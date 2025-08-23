import {
    ChatInputCommandInteraction,
    PermissionsBitField,
    EmbedBuilder,
    //@ts-ignore
    ChannelType,
} from "discord.js";
import Command from "@classes/Command";
import Category from "@enums/Category";
//@ts-ignore
import Types from "@enums/Types";

//@ts-ignore
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Helper: Regex for links
const urlRegex = /(https?:\/\/[^\s]+)/gi;

// Helper: Check if message is deletable and not pinned
const isDeletable = (msg: any) => msg.deletable && !msg.pinned;

//@ts-ignore
const getChannelTypeName = (type: number) => {
    switch (type) {
        case ChannelType.GuildText:
            return "Text";
        case ChannelType.GuildVoice:
            return "Voice";
        case ChannelType.GuildAnnouncement:
            return "Announcement";
        default:
            return "Unknown";
    }
};

export default class Purge extends Command {
    constructor(client: any) {
        super(client, {
            name: "purge",
            description:
                "Advanced, multi-mode message deletion for moderators.",
            category: Category.Moderation,
            options: [
                {
                    name: "by_count",
                    description: "Delete a specific number of recent messages.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "count",
                            description:
                                "Number of messages to delete (max 100).",
                            type: Types.Integer,
                            required: true,
                        },
                        {
                            name: "channel",
                            description:
                                "Target channel (defaults to current).",
                            type: Types.Channel,
                            required: false,
                        },
                    ],
                },
                {
                    name: "by_user",
                    description: "Delete messages from a specific user.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "user",
                            description: "User whose messages to delete.",
                            type: Types.User,
                            required: true,
                        },
                        {
                            name: "count",
                            description:
                                "Number of messages to delete (max 100).",
                            type: Types.Integer,
                            required: true,
                        },
                        {
                            name: "channel",
                            description:
                                "Target channel (defaults to current).",
                            type: Types.Channel,
                            required: false,
                        },
                    ],
                },
                {
                    name: "by_keyword",
                    description: "Delete messages containing a keyword/phrase.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "keyword",
                            description: "Keyword or phrase to match.",
                            type: Types.String,
                            required: true,
                        },
                        {
                            name: "count",
                            description:
                                "Number of messages to scan (max 100).",
                            type: Types.Integer,
                            required: true,
                        },
                        {
                            name: "channel",
                            description:
                                "Target channel (defaults to current).",
                            type: Types.Channel,
                            required: false,
                        },
                    ],
                },
                {
                    name: "with_attachments",
                    description: "Delete messages with attachments.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "count",
                            description:
                                "Number of messages to scan (max 100).",
                            type: Types.Integer,
                            required: true,
                        },
                        {
                            name: "channel",
                            description:
                                "Target channel (defaults to current).",
                            type: Types.Channel,
                            required: false,
                        },
                    ],
                },
                {
                    name: "from_bots",
                    description: "Delete messages sent by bots.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "count",
                            description:
                                "Number of messages to scan (max 100).",
                            type: Types.Integer,
                            required: true,
                        },
                        {
                            name: "channel",
                            description:
                                "Target channel (defaults to current).",
                            type: Types.Channel,
                            required: false,
                        },
                    ],
                },
                {
                    name: "with_links",
                    description: "Delete messages containing links.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "count",
                            description:
                                "Number of messages to scan (max 100).",
                            type: Types.Integer,
                            required: true,
                        },
                        {
                            name: "channel",
                            description:
                                "Target channel (defaults to current).",
                            type: Types.Channel,
                            required: false,
                        },
                    ],
                },
                {
                    name: "with_mentions",
                    description: "Delete messages mentioning users or roles.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "count",
                            description:
                                "Number of messages to scan (max 100).",
                            type: Types.Integer,
                            required: true,
                        },
                        {
                            name: "channel",
                            description:
                                "Target channel (defaults to current).",
                            type: Types.Channel,
                            required: false,
                        },
                    ],
                },
                {
                    name: "complex",
                    description:
                        "Advanced: combine filters (user, keyword, attachments, bots, links, mentions).",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "count",
                            description:
                                "Number of messages to scan (max 100).",
                            type: Types.Integer,
                            required: true,
                        },
                        {
                            name: "user",
                            description: "User to filter.",
                            type: Types.User,
                            required: false,
                        },
                        {
                            name: "keyword",
                            description: "Keyword to filter.",
                            type: Types.String,
                            required: false,
                        },
                        {
                            name: "attachments",
                            description: "Require attachments.",
                            type: Types.Boolean,
                            required: false,
                        },
                        {
                            name: "bots",
                            description: "Require bot messages.",
                            type: Types.Boolean,
                            required: false,
                        },
                        {
                            name: "links",
                            description: "Require links.",
                            type: Types.Boolean,
                            required: false,
                        },
                        {
                            name: "mentions",
                            description: "Require mentions.",
                            type: Types.Boolean,
                            required: false,
                        },
                        {
                            name: "channel",
                            description:
                                "Target channel (defaults to current).",
                            type: Types.Channel,
                            required: false,
                        },
                    ],
                },
            ],
            DefaultMemberPermissions: PermissionsBitField.Flags.ManageMessages,
            dmPermission: false,
            cooldown: 5,
            dev: false,
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        //@ts-ignore
        const embed = new EmbedBuilder().setColor(0x242429).setTimestamp();
        await interaction.deferReply({ ephemeral: true });

        //@ts-ignore
        const sub = interaction.options.getSubcommand(true);

        // Helper: Get channel or fallback
        const getChannel = () => {
            //@ts-ignore
            return (
                interaction.options.getChannel("channel") || interaction.channel
            );
        };

        // Helper: Fetch messages
        const fetchMessages = async (channel: any, limit: number) => {
            return await channel.messages.fetch({ limit });
        };

        // Helper: Bulk delete
        const bulkDelete = async (channel: any, messages: any[]) => {
            if (!messages.length) return 0;
            const deleted = await channel.bulkDelete(messages, true);
            return deleted.size;
        };

        // Helper: Filter messages with multiple criteria
        const filterMessages = (messages: any, filters: any) => {
            let arr = Array.from(messages.values());
            if (filters.user)
                arr = arr.filter(
                    (m) => (m as any).author.id === filters.user.id
                );
            if (filters.keyword)
                arr = arr.filter((m) =>
                    (m as any).content
                        .toLowerCase()
                        .includes(filters.keyword.toLowerCase())
                );
            if (filters.attachments)
                arr = arr.filter((m) => (m as any).attachments.size > 0);
            if (filters.bots) arr = arr.filter((m) => (m as any).author.bot);
            if (filters.links)
                arr = arr.filter((m) => urlRegex.test((m as any).content));
            if (filters.mentions)
                arr = arr.filter(
                    (m) =>
                        (m as any).mentions.users.size > 0 ||
                        (m as any).mentions.roles.size > 0
                );
            arr = arr.filter(isDeletable);
            return arr.slice(0, filters.count);
        };

        // Main logic
        switch (sub) {
            case "by_count": {
                const count = interaction.options.getInteger("count", true);
                const channel = getChannel();
                if (!channel || channel.type !== ChannelType.GuildText) {
                    embed.setDescription(
                        "Invalid or non-text channel specified."
                    );
                    break;
                }
                if (count < 1 || count > 100) {
                    embed.setDescription("Count must be between 1 and 100.");
                    break;
                }
                const messages = await fetchMessages(channel, count + 1);
                const deletable = Array.from(messages.values())
                    .filter(isDeletable)
                    .slice(0, count);
                const deletedCount = await bulkDelete(channel, deletable);
                embed.setDescription(
                    `🧹 Purged **${deletedCount}** messages in ${channel}.`
                );
                break;
            }
            case "by_user": {
                const user = interaction.options.getUser("user", true);
                const count = interaction.options.getInteger("count", true);
                const channel = getChannel();
                if (!channel || channel.type !== ChannelType.GuildText) {
                    embed.setDescription(
                        "Invalid or non-text channel specified."
                    );
                    break;
                }
                if (count < 1 || count > 100) {
                    embed.setDescription("Count must be between 1 and 100.");
                    break;
                }
                const messages = await fetchMessages(channel, 100);
                const filtered = Array.from(messages.values())
                    .filter(
                        (m) =>
                            (m as any).author.id === user.id && isDeletable(m)
                    )
                    .slice(0, count);
                const deletedCount = await bulkDelete(channel, filtered);
                embed.setDescription(
                    `🧹 Purged **${deletedCount}** messages from ${user.tag}.`
                );
                break;
            }
            case "by_keyword": {
                const keyword = interaction.options.getString("keyword", true);
                const count = interaction.options.getInteger("count", true);
                const channel = getChannel();
                if (!channel || channel.type !== ChannelType.GuildText) {
                    embed.setDescription(
                        "Invalid or non-text channel specified."
                    );
                    break;
                }
                if (count < 1 || count > 100) {
                    embed.setDescription("Count must be between 1 and 100.");
                    break;
                }
                const messages = await fetchMessages(channel, 100);
                const filtered = Array.from(messages.values())
                    .filter(
                        (m) =>
                            (m as any).content
                                .toLowerCase()
                                .includes(keyword.toLowerCase()) &&
                            isDeletable(m)
                    )
                    .slice(0, count);
                const deletedCount = await bulkDelete(channel, filtered);
                embed.setDescription(
                    `🧹 Purged **${deletedCount}** messages containing "${keyword}".`
                );
                break;
            }
            case "with_attachments": {
                const count = interaction.options.getInteger("count", true);
                const channel = getChannel();
                if (!channel || channel.type !== ChannelType.GuildText) {
                    embed.setDescription(
                        "Invalid or non-text channel specified."
                    );
                    break;
                }
                if (count < 1 || count > 100) {
                    embed.setDescription("Count must be between 1 and 100.");
                    break;
                }
                const messages = await fetchMessages(channel, 100);
                const filtered = Array.from(messages.values())
                    .filter(
                        (m) => (m as any).attachments.size > 0 && isDeletable(m)
                    )
                    .slice(0, count);
                const deletedCount = await bulkDelete(channel, filtered);
                embed.setDescription(
                    `🧹 Purged **${deletedCount}** messages with attachments.`
                );
                break;
            }
            case "from_bots": {
                const count = interaction.options.getInteger("count", true);
                const channel = getChannel();
                if (!channel || channel.type !== ChannelType.GuildText) {
                    embed.setDescription(
                        "Invalid or non-text channel specified."
                    );
                    break;
                }
                if (count < 1 || count > 100) {
                    embed.setDescription("Count must be between 1 and 100.");
                    break;
                }
                const messages = await fetchMessages(channel, 100);
                const filtered = Array.from(messages.values())
                    .filter((m) => (m as any).author.bot && isDeletable(m))
                    .slice(0, count);
                const deletedCount = await bulkDelete(channel, filtered);
                embed.setDescription(
                    `🧹 Purged **${deletedCount}** bot messages.`
                );
                break;
            }
            case "with_links": {
                const count = interaction.options.getInteger("count", true);
                const channel = getChannel();
                if (!channel || channel.type !== ChannelType.GuildText) {
                    embed.setDescription(
                        "Invalid or non-text channel specified."
                    );
                    break;
                }
                if (count < 1 || count > 100) {
                    embed.setDescription("Count must be between 1 and 100.");
                    break;
                }
                const messages = await fetchMessages(channel, 100);
                const filtered = Array.from(messages.values())
                    .filter(
                        (m) =>
                            urlRegex.test((m as any).content) && isDeletable(m)
                    )
                    .slice(0, count);
                const deletedCount = await bulkDelete(channel, filtered);
                embed.setDescription(
                    `🧹 Purged **${deletedCount}** messages containing links.`
                );
                break;
            }
            case "with_mentions": {
                const count = interaction.options.getInteger("count", true);
                const channel = getChannel();
                if (!channel || channel.type !== ChannelType.GuildText) {
                    embed.setDescription(
                        "Invalid or non-text channel specified."
                    );
                    break;
                }
                if (count < 1 || count > 100) {
                    embed.setDescription("Count must be between 1 and 100.");
                    break;
                }
                const messages = await fetchMessages(channel, 100);
                const filtered = Array.from(messages.values())
                    .filter(
                        (m) =>
                            ((m as any).mentions.users.size > 0 ||
                                (m as any).mentions.roles.size > 0) &&
                            isDeletable(m)
                    )
                    .slice(0, count);
                const deletedCount = await bulkDelete(channel, filtered);
                embed.setDescription(
                    `🧹 Purged **${deletedCount}** messages with mentions.`
                );
                break;
            }
            case "complex": {
                const user = interaction.options.getUser("user", false);
                const keyword = interaction.options.getString("keyword", false);
                const attachments = interaction.options.getBoolean(
                    "attachments",
                    false
                );
                const bots = interaction.options.getBoolean("bots", false);
                const links = interaction.options.getBoolean("links", false);
                const mentions = interaction.options.getBoolean(
                    "mentions",
                    false
                );
                const count = interaction.options.getInteger("count", true);
                const channel = getChannel();
                if (!channel || channel.type !== ChannelType.GuildText) {
                    embed.setDescription(
                        "Invalid or non-text channel specified."
                    );
                    break;
                }
                if (count < 1 || count > 100) {
                    embed.setDescription("Count must be between 1 and 100.");
                    break;
                }
                const messages = await fetchMessages(channel, 100);
                const filtered = filterMessages(messages, {
                    user,
                    keyword,
                    attachments,
                    bots,
                    links,
                    mentions,
                    count,
                });
                const deletedCount = await bulkDelete(channel, filtered);
                let desc = `🧹 Purged **${deletedCount}** messages`;
                const filters = [];
                if (user) filters.push(`from ${user.tag}`);
                if (keyword) filters.push(`containing "${keyword}"`);
                if (attachments) filters.push("with attachments");
                if (bots) filters.push("from bots");
                if (links) filters.push("with links");
                if (mentions) filters.push("with mentions");
                if (filters.length) desc += " " + filters.join(", ");
                desc += ".";
                embed.setDescription(desc);
                break;
            }
            default:
                embed.setDescription("Unknown subcommand.");
                break;
        }

        await interaction.editReply({ embeds: [embed] });
        return;
    }
}
