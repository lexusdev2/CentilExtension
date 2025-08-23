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
class Slowmode extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "slowmode",
            description: "Configure the slowmode duration for a specified text channel.",
            category: Category_1.default.Moderation,
            options: [
                {
                    name: "rate",
                    description: "Specify the slowmode interval. Maximum duration is six hours (21,600 seconds).",
                    type: discord_js_1.ApplicationCommandOptionType.Integer,
                    required: true,
                    choices: [
                        { name: "1s", value: 1 },
                        { name: "5s", value: 5 },
                        { name: "10s", value: 10 },
                        { name: "15s", value: 15 },
                        { name: "30s", value: 30 },
                        { name: "1m", value: 60 },
                        { name: "2m", value: 120 },
                        { name: "5m", value: 300 },
                        { name: "10m", value: 600 },
                        { name: "15m", value: 900 },
                        { name: "30m", value: 1800 },
                        { name: "1h", value: 3600 },
                        { name: "2h", value: 7200 },
                        { name: "4h", value: 14400 },
                        { name: "6h", value: 21600 },
                    ],
                },
                {
                    name: "channel",
                    description: "Select the channel in which to apply the slowmode setting.",
                    type: discord_js_1.ApplicationCommandOptionType.Channel,
                    required: false,
                },
                {
                    name: "reason",
                    description: "Provide a reason for enabling slowmode (for audit logging).",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: "silent",
                    description: "Determine whether the response should be hidden from others.",
                    type: discord_js_1.ApplicationCommandOptionType.Boolean,
                    required: false,
                },
            ],
            DefaultMemberPermissions: discord_js_1.PermissionsBitField.Flags.ManageChannels,
            dmPermission: false,
            cooldown: 5,
            dev: false,
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const rate = interaction.options.getInteger("rate");
            const channel = (interaction.options.getChannel("channel") ||
                interaction.channel);
            const reason = interaction.options.getString("reason") ||
                "No reason was provided.";
            const silent = interaction.options.getBoolean("silent") || false;
            const embed = new discord_js_1.EmbedBuilder().setColor(0x242429);
            if (rate === null || rate < 0 || rate > 21600) {
                embed.setDescription("Please provide a valid slowmode duration between 0 and 21,600 seconds (6 hours).");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            try {
                yield channel.setRateLimitPerUser(rate, reason);
            }
            catch (error) {
                embed.setDescription("❌ An error occurred while attempting to update the slowmode setting.");
                yield interaction.reply({ embeds: [embed] });
                setTimeout(() => {
                    interaction.deleteReply().catch(() => { });
                }, 60000);
                return;
            }
            embed.setDescription(`✅ Slowmode has been set to **${rate}** second(s) in <#${channel.id}>.`);
            if (reason) {
                embed.addFields({ name: "Reason", value: reason, inline: true });
            }
            return interaction.reply({ embeds: [embed], ephemeral: silent });
        });
    }
}
exports.default = Slowmode;
