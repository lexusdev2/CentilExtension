"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const chalk_1 = __importDefault(require("chalk"));
const Events_1 = __importDefault(require("../../base/classes/Events"));
const log_1 = __importDefault(require("@classes/log"));
const stripAnsi = (str) => str.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, "");
const pad = (str, len) => {
    const visible = stripAnsi(str);
    return visible.length > len
        ? visible.slice(0, len - 1) + "…"
        : str + " ".repeat(len - visible.length);
};
class Ready extends Events_1.default {
    constructor(client) {
        super(client, {
            name: discord_js_1.Events.ClientReady,
            description: "Event triggered when the Discord client has successfully initialized.",
            once: true,
        });
    }
    Execute(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            console.clear();
            const [client] = args;
            const clientId = this.client.developmentMode
                ? this.client.config.DevDiscordClientId
                : this.client.config.discordClientId;
            const rest = new discord_js_1.REST().setToken(this.client.developmentMode
                ? this.client.config.DevToken
                : this.client.config.token);
            let registeredCommands = [];
            let statusColor = "🟩";
            let statusMessage = "Operational";
            let registrationMessage = "";
            try {
                if (this.client.developmentMode) {
                    registeredCommands = (yield rest.put(discord_js_1.Routes.applicationGuildCommands(clientId, this.client.config.DevGuildId), {
                        body: this.GetJson(this.client.Commands.filter((cmd) => cmd.dev)),
                    }));
                    registrationMessage = `✅ Successfully registered ${registeredCommands.length} development command${registeredCommands.length !== 1 ? "s" : ""}.`;
                }
                else {
                    registeredCommands = (yield rest.put(discord_js_1.Routes.applicationCommands(clientId), {
                        body: this.GetJson(this.client.Commands.filter((cmd) => !cmd.dev)),
                    }));
                    registrationMessage = `✅ Successfully registered ${registeredCommands.length} global command${registeredCommands.length !== 1 ? "s" : ""}.`;
                }
                if (registeredCommands.some((c) => c.description === "Deprecated" ||
                    c.name.startsWith("test"))) {
                    statusColor = "🟨";
                    statusMessage = "Warnings Detected";
                }
            }
            catch (err) {
                statusColor = "🟥";
                statusMessage = "Initialization Failed";
                registrationMessage = `❌ Command registration encountered an error: ${err}`;
            }
            log_1.default.space("CLIENT ");
            this.PrintCommandTable(registeredCommands);
            if (this.client.developmentMode) {
                this.PrintDevCommandTable(registeredCommands);
            }
            console.log("\n" + chalk_1.default.greenBright(registrationMessage));
            console.log(chalk_1.default.bold(`\n🧠 Operational Status: ${statusColor} ${statusMessage}\n`));
            console.log(chalk_1.default.cyanBright(`✅ Bot is now running as ${client.user.tag}`));
        });
    }
    GetJson(commands) {
        const data = [];
        commands.forEach((command) => {
            var _a, _b, _c, _d;
            data.push({
                name: command.name,
                description: command.description,
                options: (_a = command.options) !== null && _a !== void 0 ? _a : [],
                default_member_permissions: (_c = (_b = command.DefaultMemberPermissions) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : "None",
                dm_permission: (_d = command.dmPermission) !== null && _d !== void 0 ? _d : true,
            });
        });
        return data;
    }
    PrintCommandTable(commands) {
        const headers = [
            "Name",
            "Description",
            "Options",
            "Permissions",
            "DM Allowed",
            "Status",
        ];
        const colWidths = [15, 40, 10, 15, 12, 24];
        const headerRow = `| ${pad(headers[0], colWidths[0])} | ${pad(headers[1], colWidths[1])} | ${pad(headers[2], colWidths[2])} | ${pad(headers[3], colWidths[3])} | ${pad(headers[4], colWidths[4])} | ${pad(headers[5], colWidths[5])} |`;
        const separatorRow = `|${"-".repeat(colWidths[0] + 2)}|${"-".repeat(colWidths[1] + 2)}|${"-".repeat(colWidths[2] + 2)}|${"-".repeat(colWidths[3] + 2)}|${"-".repeat(colWidths[4] + 2)}|${"-".repeat(colWidths[5] + 2)}|`;
        const rows = commands.map((cmd) => {
            var _a, _b, _c, _d;
            let statusIcon = "🟩";
            let statusText = chalk_1.default.green("Valid");
            if (!cmd.name || !cmd.description) {
                statusIcon = "🟥";
                statusText = chalk_1.default.red("Error: Invalid Entry");
            }
            else if (cmd.description === "Deprecated" ||
                cmd.name.startsWith("test")) {
                statusIcon = "🟨";
                statusText = chalk_1.default.yellow("Warning: Review Suggested");
            }
            return `| ${pad(cmd.name, colWidths[0])} | ${pad(cmd.description, colWidths[1])} | ${pad(String((_b = (_a = cmd.options) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0), colWidths[2])} | ${pad((_c = cmd.default_member_permissions) !== null && _c !== void 0 ? _c : "None", colWidths[3])} | ${pad(String((_d = cmd.dm_permission) !== null && _d !== void 0 ? _d : true), colWidths[4])} | ${pad(`${statusIcon} ${statusText}`, colWidths[5])} |`;
        });
        console.log("\n" +
            chalk_1.default.bold(chalk_1.default.cyanBright("📋 Registered Application Commands")));
        console.log(separatorRow);
        console.log(chalk_1.default.bold(headerRow));
        console.log(separatorRow);
        rows.forEach((row) => console.log(row));
        console.log(separatorRow);
    }
    PrintDevCommandTable(commands) {
        const devCommands = commands.filter((cmd) => { var _a, _b; return ((_a = cmd.name) === null || _a === void 0 ? void 0 : _a.startsWith("dev")) || ((_b = cmd.name) === null || _b === void 0 ? void 0 : _b.includes("test")); });
        if (devCommands.length === 0)
            return;
        const headers = ["Dev Command", "Description"];
        const colWidths = [25, 60];
        const headerRow = `| ${pad(headers[0], colWidths[0])} | ${pad(headers[1], colWidths[1])} |`;
        const separatorRow = `|${"-".repeat(colWidths[0] + 2)}|${"-".repeat(colWidths[1] + 2)}|`;
        console.log("\n" +
            chalk_1.default.bold(chalk_1.default.yellowBright("🛠️ Development-only Commands")));
        console.log(separatorRow);
        console.log(chalk_1.default.bold(headerRow));
        console.log(separatorRow);
        devCommands.forEach((cmd) => {
            const row = `| ${pad(cmd.name, colWidths[0])} | ${pad(cmd.description || "No description provided.", colWidths[1])} |`;
            console.log(row);
        });
        console.log(separatorRow);
    }
}
exports.default = Ready;
