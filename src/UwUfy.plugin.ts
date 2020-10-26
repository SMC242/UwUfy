/**
 * @name UwUfy
 * @invite AaMz4gp
 * @authorId "395598378387636234"
 * @website https://github.com/SMC242/CodingDND
 * @source https://raw.githubusercontent.com/SMC242/CodingDND/stable/CodingDND.plugin.js
 */
/*@cc_on
@if (@_jscript)
	
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();

@else@*/

// ts stuff
// @ts-ignore
const Bapi: any = BdApi;

interface settings_obj {
  activation_text: string;
  converter: converter;
}
const default_settings: settings_obj = {
  activation_text: "!uwu!",
  converter: UwUconverter,
};

/**
 * A function that converts an input string to another language
 */
interface converter {
  (to_convert: string): string;
}

/**
 * These represent Discord message objects.
 */
interface msg_type{
  content: string;  // what the message says
  invalidEmojis: Array<object>  // any emojis that failed the nitro check or don't exist
  tts: boolean;  // whether the message will be read out loud
  validNonShortcutEmojis: Array<object>;  // the emojis that passed the checks
}

/**
 * This represents the information passed to `ZLibrary.DiscordModules.MessageActions.sendMessage` as the 2nd argument
 */
type message_info = [channel_id: string, msg: msg_type, sending_request: Promise<object>]


module.exports = (() => {
  const config = {
    info: {
      name: "UwUfy",
      authors: [
        {
          name: "[DTWM] benmitchellmtbV5",
          discord_id: "395598378387636234",
          github_username: "SMC242",
        },
      ],
      version: "0.0.0",
      description:
        "Converts your messages to UwU language before sending them. Write !uwu! at the start of your message to convert it.",
      github: "https://github.com/SMC242/UwUfy",
      github_raw:
        "https://github.com/SMC242/UwUfy/blob/master/dist/UwUfy.plugin.js",
    },
    changelog: [
      { title: "New Stuff", items: ["Added more settings", "Added changelog"] },
    ],
    main: "UwUfy.plugin.js",
  };

  // @ts-ignore
  return !global.ZeresPluginLibrary
    ? class {
        _config: object;
        constructor() {
          this._config = config;
        }
        getName() {
          return config.info.name;
        }
        getAuthor() {
          return config.info.authors.map((a) => a.name).join(", ");
        }
        getDescription() {
          return config.info.description;
        }
        getVersion() {
          return config.info.version;
        }
        load() {
          Bapi.showConfirmationModal(
            "Library Missing",
            `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`,
            {
              confirmText: "Download Now",
              cancelText: "Cancel",
              onConfirm: () => {
                require("request").get(
                  "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
                  async (error, response, body) => {
                    if (error)
                      return require("electron").shell.openExternal(
                        "https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js"
                      );
                    await new Promise((r) =>
                      require("fs").writeFile(
                        require("path").join(
                          Bapi.Plugins.folder,
                          "0PluginLibrary.plugin.js"
                        ),
                        body,
                        r
                      )
                    );
                  }
                );
              },
            }
          );
        }
        start() {}
        stop() {}
      }
    : (([Plugin, Api]) => {
        const UwUfy = (Plugin, Library) => {
          const { Logger, Patcher, Settings, DiscordModules } = Library;

          return class UwUfy extends Plugin {
            settings: settings_obj;

            constructor() {
              super();
              this.settings =
                Bapi.loadData("UwUfy", "settings") ?? default_settings;
            }

            getName() {
              return config.info.name;
            }
            getAuthor() {
              return config.info.authors.map((a) => a.name).join(", ");
            }
            getDescription() {
              return config.info.description;
            }
            getVersion() {
              return config.info.version;
            }

            onStart() {
              Logger.log("Started");
              Patcher.before(Logger, "log", (t, a) => {
                a[0] = "Patched Message: " + a[0];
              });
            }

            onStop() {
              Logger.log("Stopped");
              Patcher.unpatchAll();
            }

            async save_settings(): Promise<void> {
              Bapi.saveData("UwUfy", "settings", this.settings);
            }

            /**
             * Sets the activation_text attribute of this.settings.
             * NOTE: This function exists to separate the setting logic from getSettingsPanel
             * @param new_text The new value
             */
            set_activation_text(new_text: string) {
              this.settings.activation_text = new_text;
            }

            set_converter(new_converter: converter){
              this.settings.converter = new_converter;
            }

            getSettingsPanel() {
              const converters: Array<object> = [
                {label: "UwU", value: UwUconverter}
              ]

              return Settings.SettingPanel.build(
                this.save_settings.bind(this),
                new Settings.Textbox(
                  "Activation text",
                  "The text that you must write at the start to UwUfy your message",
                  this.settings.activation_text,
                  this.set_activation_text.bind(this)
                ),
                new Settings.Dropdown(
                  "Select converter",
                  "This is the function that will be used to convert your message",
                  this.settings.converter,
                  converters,
                  this.set_converter.bind(this),
                  {
                    searchable: true
                  },
                )
              );
            }
          };
        };
        return UwUfy(Plugin, Api);
        // @ts-ignore
      })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
