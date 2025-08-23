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
const Types_1 = __importDefault(require("@enums/Types"));
//@ts-ignore
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
// Helper: Regex for links
const urlRegex = /(https?:\/\/[^\s]+)/gi;
// Helper: Check if message is deletable and not pinned
const isDeletable = (msg) => msg.deletable && !msg.pinned;
//@ts-ignore
const getChannelTypeName = (type) => {
    switch (type) {
        case discord_js_1.ChannelType.GuildText:
            return "Text";
        case discord_js_1.ChannelType.GuildVoice:
            return "Voice";
        case discord_js_1.ChannelType.GuildAnnouncement:
            return "Announcement";
        default:
            return "Unknown";
    }
};
class Purge extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "purge",
            description: "Advanced, multi-mode message deletion for moderators.",
            category: Category_1.default.Moderation,
            options: [
                {
                    name: "by_count",
                    description: "Delete a specific number of recent messages.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "count",
                            description: "Number of messages to delete (max 100).",
                            type: Types_1.default.Integer,
                            required: true,
                        },
                        {
                            name: "channel",
                            description: "Target channel (defaults to current).",
                            type: Types_1.default.Channel,
                            required: false,
                        },
                    ],
                },
                {
                    name: "by_user",
                    description: "Delete messages from a specific user.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "user",
                            description: "User whose messages to delete.",
                            type: Types_1.default.User,
                            required: true,
                        },
                        {
                            name: "count",
                            description: "Number of messages to delete (max 100).",
                            type: Types_1.default.Integer,
                            required: true,
                        },
                        {
                            name: "channel",
                            description: "Target channel (defaults to current).",
                            type: Types_1.default.Channel,
                            required: false,
                        },
                    ],
                },
                {
                    name: "by_keyword",
                    description: "Delete messages containing a keyword/phrase.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "keyword",
                            description: "Keyword or phrase to match.",
                            type: Types_1.default.String,
                            required: true,
                        },
                        {
                            name: "count",
                            description: "Number of messages to scan (max 100).",
                            type: Types_1.default.Integer,
                            required: true,
                        },
                        {
                            name: "channel",
                            description: "Target channel (defaults to current).",
                            type: Types_1.default.Channel,
                            required: false,
                        },
                    ],
                },
                {
                    name: "with_attachments",
                    description: "Delete messages with attachments.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "count",
                            description: "Number of messages to scan (max 100).",
                            type: Types_1.default.Integer,
                            required: true,
                        },
                        {
                            name: "channel",
                            description: "Target channel (defaults to current).",
                            type: Types_1.default.Channel,
                            required: false,
                        },
                    ],
                },
                {
                    name: "from_bots",
                    description: "Delete messages sent by bots.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "count",
                            description: "Number of messages to scan (max 100).",
                            type: Types_1.default.Integer,
                            required: true,
                        },
                        {
                            name: "channel",
                            description: "Target channel (defaults to current).",
                            type: Types_1.default.Channel,
                            required: false,
                        },
                    ],
                },
                {
                    name: "with_links",
                    description: "Delete messages containing links.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "count",
                            description: "Number of messages to scan (max 100).",
                            type: Types_1.default.Integer,
                            required: true,
                        },
                        {
                            name: "channel",
                            description: "Target channel (defaults to current).",
                            type: Types_1.default.Channel,
                            required: false,
                        },
                    ],
                },
                {
                    name: "with_mentions",
                    description: "Delete messages mentioning users or roles.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "count",
                            description: "Number of messages to scan (max 100).",
                            type: Types_1.default.Integer,
                            required: true,
                        },
                        {
                            name: "channel",
                            description: "Target channel (defaults to current).",
                            type: Types_1.default.Channel,
                            required: false,
                        },
                    ],
                },
                {
                    name: "complex",
                    description: "Advanced: combine filters (user, keyword, attachments, bots, links, mentions).",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "count",
                            description: "Number of messages to scan (max 100).",
                            type: Types_1.default.Integer,
                            required: true,
                        },
                        {
                            name: "user",
                            description: "User to filter.",
                            type: Types_1.default.User,
                            required: false,
                        },
                        {
                            name: "keyword",
                            description: "Keyword to filter.",
                            type: Types_1.default.String,
                            required: false,
                        },
                        {
                            name: "attachments",
                            description: "Require attachments.",
                            type: Types_1.default.Boolean,
                            required: false,
                        },
                        {
                            name: "bots",
                            description: "Require bot messages.",
                            type: Types_1.default.Boolean,
                            required: false,
                        },
                        {
                            name: "links",
                            description: "Require links.",
                            type: Types_1.default.Boolean,
                            required: false,
                        },
                        {
                            name: "mentions",
                            description: "Require mentions.",
                            type: Types_1.default.Boolean,
                            required: false,
                        },
                        {
                            name: "channel",
                            description: "Target channel (defaults to current).",
                            type: Types_1.default.Channel,
                            required: false,
                        },
                    ],
                },
            ],
            DefaultMemberPermissions: discord_js_1.PermissionsBitField.Flags.ManageMessages,
            dmPermission: false,
            cooldown: 5,
            dev: false,
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            //@ts-ignore
            const embed = new discord_js_1.EmbedBuilder().setColor(0x242429).setTimestamp();
            yield interaction.deferReply({ ephemeral: true });
            //@ts-ignore
            const sub = interaction.options.getSubcommand(true);
            // Helper: Get channel or fallback
            const getChannel = () => {
                //@ts-ignore
                return (interaction.options.getChannel("channel") || interaction.channel);
            };
            // Helper: Fetch messages
            const fetchMessages = (channel, limit) => __awaiter(this, void 0, void 0, function* () {
                return yield channel.messages.fetch({ limit });
            });
            // Helper: Bulk delete
            const bulkDelete = (channel, messages) => __awaiter(this, void 0, void 0, function* () {
                if (!messages.length)
                    return 0;
                const deleted = yield channel.bulkDelete(messages, true);
                return deleted.size;
            });
            // Helper: Filter messages with multiple criteria
            const filterMessages = (messages, filters) => {
                let arr = Array.from(messages.values());
                if (filters.user)
                    arr = arr.filter((m) => m.author.id === filters.user.id);
                if (filters.keyword)
                    arr = arr.filter((m) => m.content
                        .toLowerCase()
                        .includes(filters.keyword.toLowerCase()));
                if (filters.attachments)
                    arr = arr.filter((m) => m.attachments.size > 0);
                if (filters.bots)
                    arr = arr.filter((m) => m.author.bot);
                if (filters.links)
                    arr = arr.filter((m) => urlRegex.test(m.content));
                if (filters.mentions)
                    arr = arr.filter((m) => m.mentions.users.size > 0 ||
                        m.mentions.roles.size > 0);
                arr = arr.filter(isDeletable);
                return arr.slice(0, filters.count);
            };
            // Main logic
            switch (sub) {
                case "by_count": {
                    const count = interaction.options.getInteger("count", true);
                    const channel = getChannel();
                    if (!channel || channel.type !== discord_js_1.ChannelType.GuildText) {
                        embed.setDescription("Invalid or non-text channel specified.");
                        break;
                    }
                    if (count < 1 || count > 100) {
                        embed.setDescription("Count must be between 1 and 100.");
                        break;
                    }
                    const messages = yield fetchMessages(channel, count + 1);
                    const deletable = Array.from(messages.values())
                        .filter(isDeletable)
                        .slice(0, count);
                    const deletedCount = yield bulkDelete(channel, deletable);
                    embed.setDescription(`🧹 Purged **${deletedCount}** messages in ${channel}.`);
                    break;
                }
                case "by_user": {
                    const user = interaction.options.getUser("user", true);
                    const count = interaction.options.getInteger("count", true);
                    const channel = getChannel();
                    if (!channel || channel.type !== discord_js_1.ChannelType.GuildText) {
                        embed.setDescription("Invalid or non-text channel specified.");
                        break;
                    }
                    if (count < 1 || count > 100) {
                        embed.setDescription("Count must be between 1 and 100.");
                        break;
                    }
                    const messages = yield fetchMessages(channel, 100);
                    const filtered = Array.from(messages.values())
                        .filter((m) => m.author.id === user.id && isDeletable(m))
                        .slice(0, count);
                    const deletedCount = yield bulkDelete(channel, filtered);
                    embed.setDescription(`🧹 Purged **${deletedCount}** messages from ${user.tag}.`);
                    break;
                }
                case "by_keyword": {
                    const keyword = interaction.options.getString("keyword", true);
                    const count = interaction.options.getInteger("count", true);
                    const channel = getChannel();
                    if (!channel || channel.type !== discord_js_1.ChannelType.GuildText) {
                        embed.setDescription("Invalid or non-text channel specified.");
                        break;
                    }
                    if (count < 1 || count > 100) {
                        embed.setDescription("Count must be between 1 and 100.");
                        break;
                    }
                    const messages = yield fetchMessages(channel, 100);
                    const filtered = Array.from(messages.values())
                        .filter((m) => m.content
                        .toLowerCase()
                        .includes(keyword.toLowerCase()) &&
                        isDeletable(m))
                        .slice(0, count);
                    const deletedCount = yield bulkDelete(channel, filtered);
                    embed.setDescription(`🧹 Purged **${deletedCount}** messages containing "${keyword}".`);
                    break;
                }
                case "with_attachments": {
                    const count = interaction.options.getInteger("count", true);
                    const channel = getChannel();
                    if (!channel || channel.type !== discord_js_1.ChannelType.GuildText) {
                        embed.setDescription("Invalid or non-text channel specified.");
                        break;
                    }
                    if (count < 1 || count > 100) {
                        embed.setDescription("Count must be between 1 and 100.");
                        break;
                    }
                    const messages = yield fetchMessages(channel, 100);
                    const filtered = Array.from(messages.values())
                        .filter((m) => m.attachments.size > 0 && isDeletable(m))
                        .slice(0, count);
                    const deletedCount = yield bulkDelete(channel, filtered);
                    embed.setDescription(`🧹 Purged **${deletedCount}** messages with attachments.`);
                    break;
                }
                case "from_bots": {
                    const count = interaction.options.getInteger("count", true);
                    const channel = getChannel();
                    if (!channel || channel.type !== discord_js_1.ChannelType.GuildText) {
                        embed.setDescription("Invalid or non-text channel specified.");
                        break;
                    }
                    if (count < 1 || count > 100) {
                        embed.setDescription("Count must be between 1 and 100.");
                        break;
                    }
                    const messages = yield fetchMessages(channel, 100);
                    const filtered = Array.from(messages.values())
                        .filter((m) => m.author.bot && isDeletable(m))
                        .slice(0, count);
                    const deletedCount = yield bulkDelete(channel, filtered);
                    embed.setDescription(`🧹 Purged **${deletedCount}** bot messages.`);
                    break;
                }
                case "with_links": {
                    const count = interaction.options.getInteger("count", true);
                    const channel = getChannel();
                    if (!channel || channel.type !== discord_js_1.ChannelType.GuildText) {
                        embed.setDescription("Invalid or non-text channel specified.");
                        break;
                    }
                    if (count < 1 || count > 100) {
                        embed.setDescription("Count must be between 1 and 100.");
                        break;
                    }
                    const messages = yield fetchMessages(channel, 100);
                    const filtered = Array.from(messages.values())
                        .filter((m) => urlRegex.test(m.content) && isDeletable(m))
                        .slice(0, count);
                    const deletedCount = yield bulkDelete(channel, filtered);
                    embed.setDescription(`🧹 Purged **${deletedCount}** messages containing links.`);
                    break;
                }
                case "with_mentions": {
                    const count = interaction.options.getInteger("count", true);
                    const channel = getChannel();
                    if (!channel || channel.type !== discord_js_1.ChannelType.GuildText) {
                        embed.setDescription("Invalid or non-text channel specified.");
                        break;
                    }
                    if (count < 1 || count > 100) {
                        embed.setDescription("Count must be between 1 and 100.");
                        break;
                    }
                    const messages = yield fetchMessages(channel, 100);
                    const filtered = Array.from(messages.values())
                        .filter((m) => (m.mentions.users.size > 0 ||
                        m.mentions.roles.size > 0) &&
                        isDeletable(m))
                        .slice(0, count);
                    const deletedCount = yield bulkDelete(channel, filtered);
                    embed.setDescription(`🧹 Purged **${deletedCount}** messages with mentions.`);
                    break;
                }
                case "complex": {
                    const user = interaction.options.getUser("user", false);
                    const keyword = interaction.options.getString("keyword", false);
                    const attachments = interaction.options.getBoolean("attachments", false);
                    const bots = interaction.options.getBoolean("bots", false);
                    const links = interaction.options.getBoolean("links", false);
                    const mentions = interaction.options.getBoolean("mentions", false);
                    const count = interaction.options.getInteger("count", true);
                    const channel = getChannel();
                    if (!channel || channel.type !== discord_js_1.ChannelType.GuildText) {
                        embed.setDescription("Invalid or non-text channel specified.");
                        break;
                    }
                    if (count < 1 || count > 100) {
                        embed.setDescription("Count must be between 1 and 100.");
                        break;
                    }
                    const messages = yield fetchMessages(channel, 100);
                    const filtered = filterMessages(messages, {
                        user,
                        keyword,
                        attachments,
                        bots,
                        links,
                        mentions,
                        count,
                    });
                    const deletedCount = yield bulkDelete(channel, filtered);
                    let desc = `🧹 Purged **${deletedCount}** messages`;
                    const filters = [];
                    if (user)
                        filters.push(`from ${user.tag}`);
                    if (keyword)
                        filters.push(`containing "${keyword}"`);
                    if (attachments)
                        filters.push("with attachments");
                    if (bots)
                        filters.push("from bots");
                    if (links)
                        filters.push("with links");
                    if (mentions)
                        filters.push("with mentions");
                    if (filters.length)
                        desc += " " + filters.join(", ");
                    desc += ".";
                    embed.setDescription(desc);
                    break;
                }
                default:
                    embed.setDescription("Unknown subcommand.");
                    break;
            }
            yield interaction.editReply({ embeds: [embed] });
            return;
        });
    }
}
exports.default = Purge;
