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
const Logging_1 = require("@schemas/Logging");
class Kick extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "kick",
            description: "Remove a member from the server.",
            category: Category_1.default.Moderation,
            options: [
                {
                    name: "user",
                    description: "Member to be removed from the server.",
                    type: discord_js_1.ApplicationCommandOptionType.User,
                    required: true,
                },
                {
                    name: "reason",
                    description: "Reason for removing the member.",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: "silent",
                    description: "Do not notify others of the action.",
                    type: discord_js_1.ApplicationCommandOptionType.Boolean,
                    required: false,
                },
                {
                    name: "dm",
                    description: "Send a direct message before removal.",
                    type: discord_js_1.ApplicationCommandOptionType.Boolean,
                    required: false,
                },
                {
                    name: "days",
                    description: "Number of message days to delete (0–7).",
                    type: discord_js_1.ApplicationCommandOptionType.Integer,
                    required: false,
                    choices: Array.from({ length: 8 }, (_, i) => ({
                        name: i.toString(),
                        value: i,
                    })),
                },
            ],
            DefaultMemberPermissions: discord_js_1.PermissionsBitField.Flags.KickMembers,
            dmPermission: false,
            cooldown: 5,
            dev: false,
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const user = interaction.options.getUser("user");
            const reason = interaction.options.getString("reason") ||
                "No reason was provided.";
            const silent = interaction.options.getBoolean("silent") || false;
            const dm = interaction.options.getBoolean("dm") || false;
            const days = (_a = interaction.options.getInteger("days")) !== null && _a !== void 0 ? _a : 0;
            const embed = new discord_js_1.EmbedBuilder().setColor("#242429");
            if (!user) {
                embed.setDescription("❌ The specified user could not be located.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            if (days < 0 || days > 7) {
                embed.setDescription("❌ The 'days' option must be between 0 and 7.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            const member = (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.members.cache.get(user.id);
            if (!member) {
                embed.setDescription("❌ This member is not present in the server.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            if (!member.kickable) {
                embed.setDescription("⚠️ I cannot remove this member due to permission issues or role hierarchy.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            if (dm) {
                try {
                    yield user.send(`You have been removed from **${(_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.name}** for the following reason:\n${reason}`);
                }
                catch (_g) { }
            }
            try {
                yield member.kick(reason);
            }
            catch (_h) {
                embed.setDescription("❌ Failed to remove the member.");
                yield interaction.reply({ embeds: [embed] });
                setTimeout(() => interaction.deleteReply().catch(() => { }), 60000);
                return;
            }
            embed.setTitle("🚨 Member Removed");
            embed.setDescription(`**${user.tag}** has been removed from the server.`);
            embed.addFields({ name: "Reason", value: reason });
            embed.setTimestamp();
            yield interaction.reply({ embeds: [embed], ephemeral: silent });
            const reply = yield interaction.fetchReply();
            yield Logging_1.LoggingModel.create({
                userTarget: user.tag,
                userTargetId: user.id,
                action: "kick",
                moderator: interaction.user.tag,
                moderatorId: interaction.user.id,
                reason,
                timestamp: new Date(),
                guildId: ((_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.id) || "unknown",
                guildName: ((_e = interaction.guild) === null || _e === void 0 ? void 0 : _e.name) || "unknown",
                channelId: interaction.channelId,
                channelName: ((_f = interaction.channel) === null || _f === void 0 ? void 0 : _f.isTextBased()) &&
                    "name" in interaction.channel
                    ? interaction.channel.name
                    : "unknown",
                messageId: reply.id,
            });
            return;
        });
    }
}
exports.default = Kick;
