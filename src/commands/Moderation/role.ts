import {
    ChatInputCommandInteraction,
    PermissionsBitField,
    EmbedBuilder,
    //@ts-ignore
    ChannelType,
    //@ts-ignore
    GuildChannel,
    //@ts-ignore
    CategoryChannel,
} from "discord.js";
import Command from "@classes/Command";
import Category from "@enums/Category";
//@ts-ignore
import { LoggingModel } from "@schemas/Logging";
import Types from "@enums/Types";

export default class RoleManager extends Command {
    constructor(client: any) {
        super(client, {
            name: "role",
            description: "Manage server roles with advanced options.",
            category: Category.Moderation,
            options: [
                {
                    name: "create",
                    description: "Create a new server role with customization.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "name",
                            description: "Name for the new role.",
                            type: Types.String,
                            required: true,
                        },
                        {
                            name: "color",
                            description: "Hex color code (e.g., #1abc9c).",
                            type: Types.String,
                            required: false,
                        },
                        {
                            name: "permissions",
                            description: "Comma-separated permission flags.",
                            type: Types.String,
                            required: false,
                        },
                        {
                            name: "hoist",
                            description: "Display role members separately.",
                            type: Types.Boolean,
                            required: false,
                        },
                        {
                            name: "mentionable",
                            description: "Allow the role to be mentioned.",
                            type: Types.Boolean,
                            required: false,
                        },
                    ],
                },
                {
                    name: "delete",
                    description: "Delete an existing role by its name.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "name",
                            description: "Exact name of the role to delete.",
                            type: Types.String,
                            required: true,
                        },
                    ],
                },
                {
                    name: "info",
                    description: "Retrieve details about a specific role.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "name",
                            description: "Name of the role to inspect.",
                            type: Types.String,
                            required: true,
                        },
                    ],
                },
            ],
            DefaultMemberPermissions: PermissionsBitField.Flags.ManageRoles,
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
        const subcommand = interaction.options.getSubcommand(true);

        switch (subcommand) {
            case "create": {
                const name = interaction.options.getString("name", true);
                const color =
                    interaction.options.getString("color") || "#000000";
                const permissionsInput =
                    interaction.options.getString("permissions") || "";
                const hoist = interaction.options.getBoolean("hoist") ?? false;
                const mentionable =
                    interaction.options.getBoolean("mentionable") ?? false;

                const permissions = permissionsInput
                    .split(",")
                    .map((p) => p.trim().toUpperCase())
                    .filter(Boolean);

                try {
                    const role = await interaction.guild?.roles.create({
                        name,
                        color: parseInt(color.replace(/^#/, ""), 16),
                        permissions:
                            permissions.length > 0
                                ? PermissionsBitField.resolve(
                                      permissions as any
                                  )
                                : undefined,
                        hoist,
                        mentionable,
                        reason: `Role created by ${interaction.user.tag}`,
                    });

                    embed.setDescription(
                        `✅ The role **${role?.name}** has been successfully created.`
                    );
                } catch (error: any) {
                    embed.setDescription(
                        `❌ Failed to create the role. Details: ${
                            error.message || error
                        }`
                    );
                }

                break;
            }

            case "delete": {
                const name = interaction.options.getString("name", true);
                const role = interaction.guild?.roles.cache.find(
                    (r) => r.name === name
                );

                if (!role) {
                    embed.setDescription(
                        `❌ The role **${name}** was not found in the server.`
                    );
                    break;
                }

                try {
                    await role.delete(
                        `Role deleted by ${interaction.user.tag}`
                    );
                    embed.setDescription(
                        `✅ The role **${role.name}** has been successfully deleted.`
                    );
                } catch (error: any) {
                    embed.setDescription(
                        `❌ Failed to delete the role. Details: ${
                            error.message || error
                        }`
                    );
                }

                break;
            }

            case "info": {
                const name = interaction.options.getString("name", true);
                const role = interaction.guild?.roles.cache.find(
                    (r) => r.name === name
                );

                if (!role) {
                    embed.setDescription(
                        `❌ The role **${name}** could not be found in the server.`
                    );
                    break;
                }

                embed.setTitle(`Role Information: ${role.name}`).addFields(
                    { name: "Role ID", value: role.id, inline: false },
                    { name: "Color", value: role.hexColor, inline: false },
                    {
                        name: "Permissions",
                        value: role.permissions.toArray().join(", ") || "None",
                    },
                    {
                        name: "Displayed Separately",
                        value: role.hoist ? "Yes" : "No",
                        inline: false,
                    },
                    {
                        name: "Mentionable",
                        value: role.mentionable ? "Yes" : "No",
                        inline: false,
                    },
                    {
                        name: "Member Count",
                        value: `${role.members.size}`,
                        inline: false,
                    },
                    {
                        name: "Date Created",
                        value: `<t:${Math.floor(
                            role.createdTimestamp / 1000
                        )}:F>`,
                        inline: false,
                    }
                );

                break;
            }
        }

        await interaction.editReply({ embeds: [embed] });
        return;
    }
}
