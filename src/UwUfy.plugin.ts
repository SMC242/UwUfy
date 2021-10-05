/**
 * @name UwUfy
 * @invite d65ujkS
 * @authorId "395598378387636234"
 * @website https://github.com/SMC242/UwUfy
 * @source https://raw.githubusercontent.com/SMC242/UwUfy/master/dist/UwUfy.plugin.js
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
  converter_name: string;
}

type Matches = Array<RegExpMatchArray>;
const flatten_matches = (
  matches: IterableIterator<RegExpMatchArray>
): Matches => [...matches];
const get_matches = (expr: RegExp) => (to_match: string) =>
  flatten_matches(to_match.matchAll(expr));

const replace_at = (to_add: string) => (start: number) => (str: string) =>
  str.slice(0, start) + to_add + str.slice(start + to_add.length);
const rand_int = (max_val: number) => Math.floor(Math.random() * max_val);
const random_replace = (expr: RegExp) => (replace_chance: number) => (
  to_check: string
) => (to_add: string): string => {
  const matches = get_matches(expr)(to_check);
  let result = to_check;
  matches.forEach((m) => {
    if (!m.index) return;
    result =
      rand_int(100) > replace_chance
        ? replace_at(to_add)(m.index)(to_check)
        : result;
  });
  return result;
};

let UwUconverter: converter = function UwUconverter(
  msg_content: string
): string {
  // credit to https://gist.github.com/xezno/ba8dacbc0a0b8d1788ea24273605ffcf
  const kaomoji = [
    "^~^",
    "^~^",
    "^w^",
    ">w<",
    "UwU",
    "owo",
    "OwO",
    "O_O",
    "O_o",
    "oWo",
    "OvO",
    "UvU",
    "\*~\*",
    ":3",
    "=3",
    "<(^V^<)",
    "UmU",
  ];
  const edited_text = msg_content
    .replace(/[.]/g, "!!!")
    .replace(/th|Th/g, "f")
    .replace(/W/g, "w-w")
    .replace(/l|L|r|R/g, "w")
    .replace(/n([aeiou])/g, "ny$1")
    .toLowerCase(); // UwUfy the text
  return (
    edited_text + " " + kaomoji[Math.floor(Math.random() * kaomoji.length)]
  ); // add a kaomoji
};

const converters: { [name: string]: converter } = {
  uwu: UwUconverter,
};

const default_settings: settings_obj = {
  activation_text: "!uwu!",
  converter_name: "uwu",
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
interface msg_type {
  content: string; // what the message says
  invalidEmojis: Array<object>; // any emojis that failed the nitro check or don't exist
  tts: boolean; // whether the message will be read out loud
  validNonShortcutEmojis: Array<object>; // the emojis that passed the checks
}

/**
 * This represents the information passed to `ZLibrary.DiscordModules.MessageActions.sendMessage` as the 2nd argument
 * @element0 channel id
 * @element1 message info
 * @element2 async request to send the message
 * @element3 extra stuff I couldn't work out
 */
type message_info = [string, msg_type, Promise<object>, ...Array<unknown>];

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
      version: "1.2.0",
      description:
        "Converts your messages to UwU language before sending them. Write !uwu! at the start of your message to convert it.",
      github: "https://github.com/SMC242/UwUfy",
      github_raw:
        "https://raw.githubusercontent.com/SMC242/UwUfy/master/dist/UwUfy.plugin.js",
    },
    changelog: [
      {
        title: "Fixed false positive bug",
        type: "fixed",
        items: [
          "If you put your activation string in the middle of your message, it would UwUfy and delete the start of your message.",
          "This is now fixed.",
        ],
      },
      {
        title: "The settings are loaded properly now",
        type: "fixed",
        items: [
          "Please delete `UwUfy.config.json` in your plug-ins folder as its format is now invalid.",
          "Previously, the converter wasn't loaded when starting. This caused you to have to go and set it again each time you loaded Discord",
        ],
      },
      { title: "New Stuff", items: ["It works!"] },
      {
        title: "Critical update!",
        items: ["Added UmU to the list of possible kaomoji"],
        type: "improved",
      },
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
              // NOTE: Patcher.after is equivalent to a Python decorator that does stuff after the input function
              Patcher.after(
                DiscordModules.MessageActions,
                "sendMessage",
                this.conversion.bind(this)
              );
            }

            onStop() {
              Logger.log("Stopped");
              Patcher.unpatchAll();
            }

            /**
             * This is where the message gets edited. This is a callback to be injected into Discord so DO NOT CALL DIRECTLY
             * @param channel the channel that the message is being sent to
             * @param msg_info the msg object and such
             * @param send_status the sending request
             */
            conversion(
              channel: object,
              msg_info: message_info,
              send_status: Promise<object>
            ) {
              // @ts-ignore
              const [channel_id, msg, ..._] = msg_info;
              // check that the user intends to uwufy by looking for the activation string at the start of the message
              const length = this.settings.activation_text.length;
              const sliced = msg.content.slice(0, length);
              if (sliced != this.settings.activation_text) {
                return;
              }
              const no_prefix = msg.content
                .slice(this.settings.activation_text.length)
                .trim(); // remove the activation text and the trailing space
              msg.content = converters[this.settings.converter_name](no_prefix); // edit the message
              Bapi.showToast("UwUfied successfully!");
            }

            // settings stuff below
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

            set_converter(new_converter_name: string) {
              this.settings.converter_name = new_converter_name;
            }

            getSettingsPanel() {
              const converters: Array<object> = [
                { label: "UwU", value: "uwu" },
              ];

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
                  this.settings.converter_name,
                  converters,
                  this.set_converter.bind(this),
                  {
                    searchable: true,
                  }
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
