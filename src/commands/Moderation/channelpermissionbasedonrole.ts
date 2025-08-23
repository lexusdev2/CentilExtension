import {
    ChatInputCommandInteraction,
    AutocompleteInteraction,
    PermissionsBitField,
    EmbedBuilder,
    Role,
    ChannelType,
    GuildChannel,
    ApplicationCommandOptionChoiceData,
} from "discord.js";
import Command from "@classes/Command";
import Category from "@enums/Category";
import Types from "@enums/Types";

export default class ChannelPermissionManager extends Command {
    /**
     * Creates a new ChannelPermissionManager command instance.
     * @param client The Discord client instance.
     */
    constructor(client: any) {
        super(client, {
            name: "perm",
            description: "Manage channel permissions for roles.",
            category: Category.Moderation,
            options: [
                {
                    name: "set",
                    description: "Set permission for a role on a channel.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "channel",
                            description: "Target channel.",
                            type: Types.Channel,
                            required: true,
                        },
                        {
                            name: "role",
                            description: "Role to set permissions for.",
                            type: Types.Role,
                            required: true,
                        },
                        {
                            name: "permissions",
                            description:
                                "Permissions to set (comma separated).",
                            type: Types.String,
                            required: true,
                            autocomplete: true,
                        },
                    ],
                },
                {
                    name: "remove",
                    description:
                        "Remove permission overwrite for a role on a channel.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "channel",
                            description: "Target channel.",
                            type: Types.Channel,
                            required: true,
                        },
                        {
                            name: "role",
                            description: "Role to remove permissions from.",
                            type: Types.Role,
                            required: true,
                        },
                    ],
                },
                {
                    name: "setall",
                    description: "Set permissions for a role on all channels.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "role",
                            description: "Role to set permissions for.",
                            type: Types.Role,
                            required: true,
                        },
                        {
                            name: "permissions",
                            description:
                                "Permissions to set (comma separated).",
                            type: Types.String,
                            required: true,
                            autocomplete: true,
                        },
                    ],
                },
                {
                    name: "removeall",
                    description:
                        "Remove permission overwrite for a role on all channels.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "role",
                            description: "Role to remove permissions from.",
                            type: Types.Role,
                            required: true,
                        },
                    ],
                },
            ],
            DefaultMemberPermissions: PermissionsBitField.Flags.ManageChannels,
            dmPermission: false,
            cooldown: 5,
            dev: false,
        });
    }

    /**
     * Parses a comma-separated permissions string into an array of valid permission keys.
     * @param permString Permissions string, comma separated.
     * @returns Array of valid permission keys.
     */
    private parsePermissions(
        permString: string
    ): (keyof typeof PermissionsBitField.Flags)[] {
        const allPerms = Object.keys(PermissionsBitField.Flags);
        return permString
            .split(",")
            .map((p) => p.trim())
            .filter((p) =>
                allPerms.includes(p)
            ) as (keyof typeof PermissionsBitField.Flags)[];
    }

    /**
     * Handles the autocomplete interaction for permission option.
     * Suggests permission flags that start with the current input.
     * @param interaction AutocompleteInteraction instance.
     */
    async autocomplete(interaction: AutocompleteInteraction) {
        const focusedOption = interaction.options.getFocused(true);
        if (
            focusedOption.name === "permissions" &&
            typeof focusedOption.value === "string"
        ) {
            const entered = focusedOption.value.toUpperCase();

            const allPermissions = Object.keys(PermissionsBitField.Flags);

            // For comma-separated input, autocomplete only the last fragment:
            const parts = entered.split(",");
            const lastPart = parts.pop()?.trim() ?? "";

            // Filter permissions that start with the last fragment
            const filtered = allPermissions
                .filter((perm) => perm.startsWith(lastPart))
                .slice(0, 25) // Discord limits to 25 choices max
                .map<ApplicationCommandOptionChoiceData>((perm) => ({
                    name: perm,
                    value: perm,
                }));

            // If user already typed previous permissions, keep them in the value suggestion
            const baseValue = parts.length ? parts.join(",") + ", " : "";

            await interaction.respond(
                filtered.map((choice) => ({
                    name: choice.name,
                    value: baseValue + choice.value,
                }))
            );
        } else {
            await interaction.respond([]);
        }
    }

    /**
     * Executes the command with the given interaction.
     * @param interaction The ChatInputCommandInteraction instance.
     */
    async Execute(interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(0x242429).setTimestamp();
        await interaction.deferReply({ ephemeral: true });

        const subcommand = interaction.options.getSubcommand(true);
        const guild = interaction.guild;

        if (!guild) {
            embed.setDescription(
                "❌ This command can only be used in a server."
            );
            return interaction.editReply({ embeds: [embed] });
        }

        try {
            switch (subcommand) {
                case "set": {
                    const channel = interaction.options.getChannel(
                        "channel",
                        true
                    ) as GuildChannel;
                    const role = interaction.options.getRole(
                        "role",
                        true
                    ) as Role;
                    const permsString = interaction.options.getString(
                        "permissions",
                        true
                    );

                    const permissions = this.parsePermissions(permsString);
                    if (!permissions.length) {
                        embed.setDescription(
                            "❌ No valid permissions specified."
                        );
                        return interaction.editReply({ embeds: [embed] });
                    }

                    const allowPermissions = permissions.reduce(
                        (acc, perm) => ({ ...acc, [perm]: true }),
                        {}
                    );

                    await channel.permissionOverwrites.edit(
                        role,
                        allowPermissions
                    );

                    embed.setDescription(
                        `✅ Permissions \`${permissions.join(
                            ", "
                        )}\` set for role <@&${role.id}> on channel <#${
                            channel.id
                        }>.`
                    );
                    return interaction.editReply({ embeds: [embed] });
                }

                case "remove": {
                    const channel = interaction.options.getChannel(
                        "channel",
                        true
                    ) as GuildChannel;
                    const role = interaction.options.getRole(
                        "role",
                        true
                    ) as Role;

                    await channel.permissionOverwrites.delete(role);

                    embed.setDescription(
                        `✅ Permission overwrites removed for role <@&${role.id}> on channel <#${channel.id}>.`
                    );
                    return interaction.editReply({ embeds: [embed] });
                }

                case "setall": {
                    const role = interaction.options.getRole(
                        "role",
                        true
                    ) as Role;
                    const permsString = interaction.options.getString(
                        "permissions",
                        true
                    );

                    const permissions = this.parsePermissions(permsString);
                    if (!permissions.length) {
                        embed.setDescription(
                            "❌ No valid permissions specified."
                        );
                        return interaction.editReply({ embeds: [embed] });
                    }

                    const allowPermissions = permissions.reduce(
                        (acc, perm) => ({ ...acc, [perm]: true }),
                        {}
                    );

                    const channels = guild.channels.cache.filter(
                        (c) =>
                            c.type === ChannelType.GuildText ||
                            c.type === ChannelType.GuildVoice
                    );

                    for (const channel of channels.values()) {
                        await channel.permissionOverwrites.edit(
                            role,
                            allowPermissions
                        );
                    }

                    embed.setDescription(
                        `✅ Permissions \`${permissions.join(
                            ", "
                        )}\` set for role <@&${
                            role.id
                        }> on all text and voice channels.`
                    );
                    return interaction.editReply({ embeds: [embed] });
                }

                case "removeall": {
                    const role = interaction.options.getRole(
                        "role",
                        true
                    ) as Role;

                    const channels = guild.channels.cache.filter(
                        (c) =>
                            c.type === ChannelType.GuildText ||
                            c.type === ChannelType.GuildVoice
                    );

                    for (const channel of channels.values()) {
                        await channel.permissionOverwrites.delete(role);
                    }

                    embed.setDescription(
                        `✅ Permission overwrites removed for role <@&${role.id}> on all text and voice channels.`
                    );
                    return interaction.editReply({ embeds: [embed] });
                }

                default: {
                    embed.setDescription("❌ Unknown subcommand.");
                    return interaction.editReply({ embeds: [embed] });
                }
            }
        } catch (error) {
            embed.setDescription(`❌ Error: ${(error as Error).message}`);
            return interaction.editReply({ embeds: [embed] });
        }
    }
}
