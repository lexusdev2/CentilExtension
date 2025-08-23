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
//@ts-ignore
const Logging_1 = require("@schemas/Logging");
const Types_1 = __importDefault(require("@enums/Types"));
const builders_1 = require("@discordjs/builders");
class Ban extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "ban",
            description: "Permanently remove a user or bot from the server.",
            category: Category_1.default.Moderation,
            options: [
                {
                    name: "user",
                    description: "Ban a user from the server.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "target",
                            description: "User to be permanently banned.",
                            type: Types_1.default.User,
                            required: true,
                        },
                        {
                            name: "dm",
                            description: "Send a DM to the user about the ban.",
                            type: Types_1.default.Boolean,
                            required: true,
                        },
                        {
                            name: "silent",
                            description: "Do not show ban publicly but log it.",
                            type: Types_1.default.Boolean,
                            required: true,
                        },
                        {
                            name: "reason",
                            description: "The reason for banning the user.",
                            type: Types_1.default.String,
                            required: false,
                        },
                    ],
                },
                {
                    name: "bot",
                    description: "Ban a bot from the server.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "target",
                            description: "Bot to be permanently banned.",
                            type: Types_1.default.User,
                            required: true,
                        },
                        {
                            name: "silent",
                            description: "Do not show ban publicly but log it.",
                            type: Types_1.default.Boolean,
                            required: true,
                        },
                        {
                            name: "reason",
                            description: "The reason for banning the bot.",
                            type: Types_1.default.String,
                            required: false,
                        },
                    ],
                },
            ],
            DefaultMemberPermissions: discord_js_1.PermissionsBitField.Flags.BanMembers,
            dmPermission: false,
            cooldown: 5,
            dev: false,
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply({});
            const embed = new builders_1.EmbedBuilder().setColor(0x242429).setTimestamp();
            const target = interaction.options.getUser("target");
            const reason = interaction.options.getString("reason") ||
                "No reason was provided.";
            const dm = interaction.options.getBoolean("dm") || false;
            const silent = interaction.options.getBoolean("silent") || false;
            if (!interaction.guild ||
                !interaction.guild.members.me ||
                !interaction.guild.members.me.permissions.has(discord_js_1.PermissionsBitField.Flags.BanMembers)) {
                embed.setDescription("I do not have permission to ban members.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            if (!target) {
                embed.setDescription("The specified target user could not be found.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            if (target.id === interaction.user.id) {
                embed.setDescription("You cannot ban yourself.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            if (target.id === interaction.client.user.id) {
                embed.setDescription("You cannot ban this bot.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            const member = yield interaction.guild.members
                .fetch(target.id)
                .catch(() => null);
            if (!member || !member.bannable) {
                embed.setDescription("I cannot ban this user. Check my role position and permissions.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            try {
                if (dm) {
                    embed.setDescription(`You have been permanently banned from **${interaction.guild.name}**.\n\n` +
                        `**Reason:** \`${reason}\`\n\n` +
                        `If you believe this was a mistake, contact the server admins.`);
                    yield target.send({ embeds: [embed] }).catch(() => { });
                }
                yield member.ban({ reason });
                embed.setDescription(`✅ **${target.tag}** was banned from **${interaction.guild.name}**.\n\n` +
                    `**Reason:** \`${reason}\`\n` +
                    `**Silent:** \`${silent}\``);
                yield interaction.reply({ embeds: [embed], ephemeral: silent });
                const logEntry = new Logging_1.LoggingModel({
                    usrTag: target.tag,
                    usrName: target.username,
                    usrId: target.id,
                    stffTag: interaction.user.tag,
                    stffName: interaction.user.username,
                    stffId: interaction.user.id,
                    action: "Ban",
                    reason,
                    silent,
                    dm,
                    timestamp: new Date(),
                    channelId: interaction.channelId,
                    gldId: interaction.guild.id,
                    gldName: interaction.guild.name,
                    gldIcon: interaction.guild.iconURL(),
                });
                yield logEntry.save();
            }
            catch (_a) {
                embed.setDescription("❌ An error occurred while banning this user.");
                yield interaction.reply({ embeds: [embed] });
                setTimeout(() => interaction.deleteReply().catch(() => { }), 60000);
            }
            return;
        });
    }
}
exports.default = Ban;
