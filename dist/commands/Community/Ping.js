"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("@classes/Command"));
const Category_1 = __importDefault(require("@enums/Category"));
class Ping extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "ping",
            description: "Ping Pong!",
            category: Category_1.default.Utilities,
            options: [],
            DefaultMemberPermissions: discord_js_1.PermissionsBitField.Flags.UseApplicationCommands,
            dmPermission: true,
            cooldown: 3,
            dev: true,
        });
    }
    Execute(interaction) {
        interaction.reply({
            content: `Pong! \`${this.client.ws.ping}ms\``,
            ephemeral: true,
        });
    }
}
exports.default = Ping;
