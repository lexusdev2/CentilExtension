import {
    ChatInputCommandInteraction,
    PermissionsBitField,
    EmbedBuilder,
    ChannelType,
    GuildChannel,
    CategoryChannel,
} from "discord.js";
import Command from "@classes/Command";
import Category from "@enums/Category";
//@ts-ignore
import { LoggingModel } from "@schemas/Logging";
import Types from "@enums/Types";

export default class ChannelManager extends Command {
    constructor(client: any) {
        super(client, {
            name: "channel",
            description: "Advanced channel management commands.",
            category: Category.Moderation,
            options: [
                {
                    name: "create",
                    description: "Create a new channel with advanced options.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "name",
                            description: "Channel name.",
                            type: Types.Channel,
                            required: true,
                        },
                        {
                            name: "topic",
                            description: "Channel topic.",
                            type: Types.String,
                            required: false,
                        },
                        {
                            name: "slowmode",
                            description: "Slowmode (seconds).",
                            type: Types.Integer,
                            required: false,
                        },
                        {
                            name: "adult",
                            description: "Is NSFW?",
                            type: Types.Boolean,
                            required: false,
                        },
                        {
                            name: "category",
                            description: "Parent category name.",
                            type: Types.String,
                            required: false,
                        },
                        {
                            name: "private",
                            description: "Make channel private.",
                            type: Types.Boolean,
                            required: false,
                        },
                        {
                            name: "user",
                            description: "User to grant access (if private).",
                            type: Types.User,
                            required: false,
                        },
                    ],
                },
                {
                    name: "delete",
                    description: "Delete a channel by name or ID.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "identifier",
                            description: "Channel name or ID.",
                            type: Types.Channel,
                            required: true,
                        },
                        {
                            name: "reason",
                            description: "Reason for deletion.",
                            type: Types.String,
                            required: false,
                        },
                    ],
                },
                {
                    name: "info",
                    description: "Get detailed info about a channel.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "identifier",
                            description: "Channel name or ID.",
                            type: Types.Channel,
                            required: true,
                        },
                    ],
                },
                {
                    name: "locking",
                    description:
                        "Sets what state should the channel should be.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "identifier",
                            description: "Channel name or ID.",
                            type: Types.Channel,
                            required: true,
                            options: [
                                {
                                    name: "lock",
                                    description: "Lock the channel.",
                                    type: Types.Boolean,
                                    required: true,
                                },
                                {
                                    name: "reason",
                                    description:
                                        "Reason for locking the channel.",
                                    type: Types.String,
                                    required: false,
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "lockdown",
                    description: "Sets all channel to lock.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "lock",
                            description: "Should the channel be locked?",
                            type: Types.Boolean,
                            required: true,
                            options: [],
                        },
                    ],
                },
                {
                    name: "list",
                    description: "List all channels in the server.",
                    type: Types.SubCommand,
                },
            ],
            DefaultMemberPermissions: PermissionsBitField.Flags.ManageChannels,
            dmPermission: false,
            cooldown: 5,
            dev: false,
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(0x242429).setTimestamp();
        await interaction.deferReply({ ephemeral: true });

        const subcommand = interaction.options.getSubcommand(true);

        switch (subcommand) {
            case "create": {
                const name = interaction.options.getString("name", true);
                const topic =
                    interaction.options.getString("topic") ?? undefined;
                const slowmode =
                    interaction.options.getInteger("slowmode") ?? 0;
                const adult = interaction.options.getBoolean("adult") ?? false;
                const categoryName =
                    interaction.options.getString("category") ?? undefined;
                const isPrivate =
                    interaction.options.getBoolean("private") ?? false;
                const user = interaction.options.getUser("user") ?? undefined;

                let parentId: string | undefined = undefined;
                if (categoryName) {
                    const category = interaction.guild?.channels.cache.find(
                        (c) =>
                            c.type === ChannelType.GuildCategory &&
                            c.name === categoryName
                    ) as CategoryChannel | undefined;
                    if (!category) {
                        embed.setDescription(
                            `❌ Category "${categoryName}" not found.`
                        );
                        return interaction.editReply({ embeds: [embed] });
                    }
                    parentId = category.id;
                }

                let permissionOverwrites = undefined;
                if (isPrivate) {
                    permissionOverwrites = [
                        {
                            id: interaction.guild!.roles.everyone.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                    ];
                    if (user) {
                        permissionOverwrites.push({
                            id: user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        } as any);
                    }
                }

                const createdChannel = await interaction.guild?.channels.create(
                    {
                        name,
                        type: ChannelType.GuildText,
                        topic,
                        rateLimitPerUser: slowmode,
                        nsfw: adult,
                        parent: parentId,
                        permissionOverwrites,
                    }
                );

                embed.setDescription(
                    `✅ Channel <#${createdChannel?.id}> created successfully.${
                        isPrivate ? " (Private)" : ""
                    }`
                );
                return interaction.editReply({ embeds: [embed] });
            }

            case "delete": {
                const identifier = interaction.options.getString(
                    "identifier",
                    true
                );
                const reason =
                    interaction.options.getString("reason") ??
                    "No reason provided.";

                let channel = interaction.guild?.channels.cache.find(
                    (c) => c.id === identifier || c.name === identifier
                ) as GuildChannel | undefined;

                if (!channel) {
                    embed.setDescription(
                        `❌ Channel "${identifier}" not found.`
                    );
                    return interaction.editReply({ embeds: [embed] });
                }

                await channel.delete(reason);
                embed.setDescription(
                    `🗑️ Channel "${channel.name}" deleted successfully.`
                );
                return interaction.editReply({ embeds: [embed] });
            }

            case "info": {
                const identifier = interaction.options.getString(
                    "identifier",
                    true
                );

                let channel = interaction.guild?.channels.cache.find(
                    (c) => c.id === identifier || c.name === identifier
                ) as GuildChannel | undefined;

                if (!channel) {
                    embed.setDescription(
                        `❌ Channel "${identifier}" not found.`
                    );
                    return interaction.editReply({ embeds: [embed] });
                }

                embed.setDescription(
                    `**Channel Info:**\n` +
                        `• Name: ${channel.name}\n` +
                        `• ID: ${channel.id}\n` +
                        `• Type: ${ChannelType[channel.type]}\n` +
                        `• NSFW: ${
                            "nsfw" in channel && (channel as any).nsfw
                                ? "Yes"
                                : "No"
                        }\n` +
                        `• Parent: ${
                            channel.parent ? channel.parent.name : "None"
                        }\n` +
                        `• Position: ${channel.position}\n` +
                        `• Created: <t:${Math.floor(
                            channel.createdTimestamp / 1000
                        )}:R>`
                );
                return interaction.editReply({ embeds: [embed] });
            }

            case "list": {
                const channels = interaction.guild?.channels.cache
                    .filter(
                        (c) =>
                            c.type === ChannelType.GuildText ||
                            c.type === ChannelType.GuildVoice
                    )
                    .sort((a, b) => a.position - b.position)
                    .map((c) => `• <#${c.id}> (${ChannelType[c.type]})`)
                    .join("\n");

                embed.setDescription(
                    `**Server Channels:**\n${
                        channels?.length ? channels : "No channels found."
                    }`
                );
                return interaction.editReply({ embeds: [embed] });
            }

            case "locking": {
                const identifier = interaction.options.getString(
                    "identifier",
                    true
                );
                const lock = interaction.options.getBoolean("lock", true);
                const reason =
                    interaction.options.getString("reason") ??
                    "No reason provided.";

                let channel = interaction.guild?.channels.cache.find(
                    (c) => c.id === identifier || c.name === identifier
                ) as GuildChannel | undefined;

                if (!channel) {
                    embed.setDescription(
                        `❌ Channel "${identifier}" not found.`
                    );
                    return interaction.editReply({ embeds: [embed] });
                }

                if (channel.type !== ChannelType.GuildText) {
                    embed.setDescription(
                        "❌ This command can only be used on text channels."
                    );
                    return interaction.editReply({ embeds: [embed] });
                }

                await channel.permissionOverwrites.edit(
                    interaction.guild!.roles.everyone,
                    {
                        SendMessages: !lock,
                        ViewChannel: !lock,
                    }
                );

                embed.setDescription(
                    `🔒 Channel <#${channel.id}> is now ${
                        lock ? "locked" : "unlocked"
                    }. Reason: ${reason}`
                );
                return interaction.editReply({ embeds: [embed] });
            }

            case "lockdown": {
                const lock = interaction.options.getBoolean("lock", true);

                const channels = interaction.guild?.channels.cache.filter(
                    (c) =>
                        c.type === ChannelType.GuildText ||
                        c.type === ChannelType.GuildVoice
                );

                if (!channels || channels.size === 0) {
                    embed.setDescription("❌ No channels found in the server.");
                    return interaction.editReply({ embeds: [embed] });
                }

                for (const channel of channels.values()) {
                    if (channel.type !== ChannelType.GuildText) continue;

                    await channel.permissionOverwrites.edit(
                        interaction.guild!.roles.everyone,
                        {
                            SendMessages: !lock,
                            ViewChannel: !lock,
                        }
                    );
                }

                embed.setDescription(
                    `🔒 All text channels are now ${
                        lock ? "locked" : "unlocked"
                    }.`
                );
                return interaction.editReply({ embeds: [embed] });
            }
        }

        return;
    }
}
