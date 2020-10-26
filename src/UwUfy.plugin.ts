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

// @ts-ignore
const Bapi: any = BdApi;

module.exports = (() => {
  const config = {
    info: {
      name: "Example Plugin",
      authors: [
        {
          name: "Zerebos",
          discord_id: "249746236008169473",
          github_username: "rauenzi",
          twitter_username: "ZackRauen",
        },
      ],
      version: "0.0.3",
      description: "Patcher Test Description",
      github: "",
      github_raw: "",
    },
    changelog: [
      { title: "New Stuff", items: ["Added more settings", "Added changelog"] },
      {
        title: "Bugs Squashed",
        type: "fixed",
        items: ["React errors on reload"],
      },
      {
        title: "Improvements",
        type: "improved",
        items: ["Improvements to the base plugin"],
      },
      {
        title: "On-going",
        type: "progress",
        items: [
          "More modals and popouts being added",
          "More classes and modules being added",
        ],
      },
    ],
    main: "index.js",
  };

  // @ts-ignore
  return !global.ZeresPluginLibrary
    ? class {
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
        const plugin = (Plugin, Library) => {
          const { Logger, Patcher, Settings } = Library;

          return class ExamplePlugin extends Plugin {
            constructor() {
              super();
              this.defaultSettings = {};
              this.defaultSettings.color = "#ff0000";
              this.defaultSettings.option = 50;
              this.defaultSettings.keybind = [162, 74];
              this.defaultSettings.radio = "weiner";
              this.defaultSettings.slider1 = 30;
              this.defaultSettings.slider2 = 54;
              this.defaultSettings.textbox = "nothing";
              this.defaultSettings.switch1 = false;
              this.defaultSettings.switch2 = true;
              this.defaultSettings.switch3 = true;
              this.defaultSettings.switch4 = false;
              this.defaultSettings.file = undefined;
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

            getSettingsPanel() {
              return Settings.SettingPanel.build(
                this.save_settings.bind(this),
                new Settings.SettingGroup("Example Plugin Settings").append(
                  null
                )
              );
            }
          };
        };
        return plugin(Plugin, Api);
        // @ts-ignore
      })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
