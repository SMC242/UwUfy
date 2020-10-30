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
const Bapi = BdApi;
let UwUconverter = function UwUconverter(msg_content) {
    // credit to https://gist.github.com/xezno/ba8dacbc0a0b8d1788ea24273605ffcf
    const kaomoji = [
        "^~^",
        "UwU",
        "OwO",
        "O_O",
        "O_o",
        "oWo",
        "OvO",
        "UvU",
        "*~*",
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
        .toLowerCase(); // UwUfy the text
    return (edited_text + " " + kaomoji[Math.floor(Math.random() * kaomoji.length)]); // add a kaomoji
};
const converters = {
    uwu: UwUconverter,
};
const default_settings = {
    activation_text: "!uwu!",
    converter_name: "uwu",
};
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
            version: "1.1.0",
            description: "Converts your messages to UwU language before sending them. Write !uwu! at the start of your message to convert it.",
            github: "https://github.com/SMC242/UwUfy",
            github_raw: "https://raw.githubusercontent.com/SMC242/UwUfy/master/dist/UwUfy.plugin.js",
        },
        changelog: [
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
                Bapi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                    confirmText: "Download Now",
                    cancelText: "Cancel",
                    onConfirm: () => {
                        require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                            if (error)
                                return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                            await new Promise((r) => require("fs").writeFile(require("path").join(Bapi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                        });
                    },
                });
            }
            start() { }
            stop() { }
        }
        : (([Plugin, Api]) => {
            const UwUfy = (Plugin, Library) => {
                const { Logger, Patcher, Settings, DiscordModules } = Library;
                return class UwUfy extends Plugin {
                    constructor() {
                        var _a;
                        super();
                        this.settings = (_a = Bapi.loadData("UwUfy", "settings")) !== null && _a !== void 0 ? _a : default_settings;
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
                        Patcher.after(DiscordModules.MessageActions, "sendMessage", this.conversion.bind(this));
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
                    conversion(channel, msg_info, send_status) {
                        // @ts-ignore
                        const [channel_id, msg, ..._] = msg_info;
                        // check that the user intends to uwufy
                        if (!(msg.content.indexOf(this.settings.activation_text) >= 0)) {
                            return;
                        }
                        const no_prefix = msg.content
                            .slice(this.settings.activation_text.length)
                            .trim(); // remove the activation text and the trailing space
                        msg.content = converters[this.settings.converter_name](no_prefix); // edit the message
                        Bapi.showToast("UwUfied successfully!");
                    }
                    // settings stuff below
                    async save_settings() {
                        Bapi.saveData("UwUfy", "settings", this.settings);
                    }
                    /**
                     * Sets the activation_text attribute of this.settings.
                     * NOTE: This function exists to separate the setting logic from getSettingsPanel
                     * @param new_text The new value
                     */
                    set_activation_text(new_text) {
                        this.settings.activation_text = new_text;
                    }
                    set_converter(new_converter_name) {
                        this.settings.converter_name = new_converter_name;
                    }
                    getSettingsPanel() {
                        const converters = [
                            { label: "UwU", value: "uwu" },
                        ];
                        return Settings.SettingPanel.build(this.save_settings.bind(this), new Settings.Textbox("Activation text", "The text that you must write at the start to UwUfy your message", this.settings.activation_text, this.set_activation_text.bind(this)), new Settings.Dropdown("Select converter", "This is the function that will be used to convert your message", this.settings.converter_name, converters, this.set_converter.bind(this), {
                            searchable: true,
                        }));
                    }
                };
            };
            return UwUfy(Plugin, Api);
            // @ts-ignore
        })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
//# sourceMappingURL=UwUfy.plugin.js.map