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
class Pause extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "pause",
            description: "Pauses the currently playing music.",
            category: Category_1.default.Music,
            options: [],
            cooldown: 2,
            DefaultMemberPermissions: discord_js_1.PermissionsBitField.Flags.Connect,
            dmPermission: false,
            dev: false,
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const client = this.client;
            const embed = new discord_js_1.EmbedBuilder().setColor(0x2b2d31).setTimestamp();
            yield interaction.deferReply({ ephemeral: true });
            const player = client.riffy.players.get(interaction.guildId);
            if (!player || !player.current) {
                embed
                    .setTitle("Unable to Pause")
                    .setDescription("❌ Nothing is currently playing.");
                return interaction.editReply({ embeds: [embed] });
            }
            if (player.paused) {
                embed
                    .setTitle("Already Paused")
                    .setDescription("❌ The player is already paused.");
                return interaction.editReply({ embeds: [embed] });
            }
            player.pause(true);
            const track = player.current;
            const thumbnailUrl = `https://img.youtube.com/vi/${track.info.identifier}/hqdefault.jpg`;
            embed
                .setTitle("⏸️ Music Paused")
                .setDescription(`[${track.info.title}](${track.info.uri})`)
                .addFields({
                name: "Requested by",
                value: `<@${((_a = track.info.requester) === null || _a === void 0 ? void 0 : _a.id) || interaction.user.id}>`,
                inline: true,
            })
                .setThumbnail(thumbnailUrl);
            return interaction.editReply({ embeds: [embed] });
        });
    }
}
exports.default = Pause;
