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
const Command_1 = __importDefault(require("@classes/Command"));
const Category_1 = __importDefault(require("@enums/Category"));
const builders_1 = require("@discordjs/builders");
class Loop extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "loop",
            description: "Toggles queue loop mode on or off.",
            category: Category_1.default.Music,
            DefaultMemberPermissions: discord_js_1.PermissionsBitField.Flags.Connect,
            dmPermission: false,
            options: [],
            cooldown: 0,
            dev: false,
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = this.client;
            const embed = new builders_1.EmbedBuilder().setColor(0x2b2d31).setTimestamp();
            yield interaction.deferReply({ ephemeral: true });
            const player = client.riffy.players.get(interaction.guildId);
            if (!player) {
                embed
                    .setTitle("Nothing Playing")
                    .setDescription("❌ There is no active player in this server.");
                return interaction.editReply({ embeds: [embed] });
            }
            const newMode = player.loop === "none" ? "queue" : "none";
            player.setLoop(newMode);
            embed
                .setTitle("🔁 Loop Toggled")
                .setDescription(`${newMode === "queue" ? "Enabled" : "Disabled"} queue loop mode.`)
                .addFields({
                name: "Requested by",
                value: `<@${interaction.user.id}>`,
                inline: false,
            });
            return interaction.editReply({ embeds: [embed] });
        });
    }
}
exports.default = Loop;
