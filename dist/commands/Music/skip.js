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
class Skip extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "skip",
            description: "Skips the currently playing track.",
            category: Category_1.default.Music,
            cooldown: 3,
            dmPermission: false,
            dev: false,
            DefaultMemberPermissions: discord_js_1.PermissionsBitField.Flags.Connect,
            options: [],
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const client = this.client;
            const embed = new discord_js_1.EmbedBuilder().setColor(0x2b2d31).setTimestamp();
            yield interaction.deferReply({ ephemeral: true });
            const member = interaction.member;
            const voiceChannel = (_a = member.voice) === null || _a === void 0 ? void 0 : _a.channel;
            if (!voiceChannel) {
                embed
                    .setTitle("Voice Channel Required")
                    .setDescription("❌ You must be in a voice channel to use this command.");
                return interaction.editReply({ embeds: [embed] });
            }
            const player = client.riffy.players.get(interaction.guildId);
            if (!player) {
                embed
                    .setTitle("Nothing Playing")
                    .setDescription("❌ There is no active player.");
                return interaction.editReply({ embeds: [embed] });
            }
            if (!player.queue.length) {
                embed
                    .setTitle("Queue Empty")
                    .setDescription("❌ No more tracks to skip to.");
                return interaction.editReply({ embeds: [embed] });
            }
            player.stop();
            embed
                .setTitle("Track Skipped")
                .setDescription("⏭️ Skipped the current track.");
            return interaction.editReply({ embeds: [embed] });
        });
    }
}
exports.default = Skip;
