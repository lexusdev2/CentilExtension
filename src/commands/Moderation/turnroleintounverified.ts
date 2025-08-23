import {
    ChatInputCommandInteraction,
    PermissionsBitField,
    EmbedBuilder,
    ChannelType,
    GuildTextBasedChannel,
    Role,
} from "discord.js";
import Command from "@classes/Command";
import Category from "@enums/Category";

// @ts-ignore
import Types from "@enums/Types";

export default class TurnRoleIntoUnverified extends Command {
    constructor(client: any) {
        super(client, {
            name: "turnroleintounverified",
            description:
                "Restrict a role to only view and interact with a verification channel.",
            category: Category.Moderation,
            options: [
                {
                    name: "role",
                    description: "The role to restrict.",
                    type: Types.Role,
                    required: true,
                },
                {
                    name: "channel",
                    description:
                        "The only channel the role can access (e.g., for verification).",
                    type: Types.Channel,
                    channelTypes: [ChannelType.GuildText],
                    required: true,
                },
            ],
            DefaultMemberPermissions: PermissionsBitField.Flags.ManageRoles,
            dmPermission: false,
            cooldown: 5,
            dev: false,
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(0x242429).setTimestamp();
        await interaction.deferReply({ ephemeral: true });

        const role = interaction.options.getRole("role", true) as Role;
        const targetChannel = interaction.options.getChannel(
            "channel",
            true
        ) as GuildTextBasedChannel;

        const guild = interaction.guild;
        if (!guild) {
            embed.setDescription(
                "❌ This command can only be used in a guild."
            );
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const failedChannels: string[] = [];

        for (const [, channel] of guild.channels.cache) {
            // @ts-ignore
            if (
                !channel?.isTextBased?.() ||
                !channel?.permissionsFor ||
                !("permissionOverwrites" in channel)
            )
                continue;

            try {
                await (channel as any).permissionOverwrites.edit(role, {
                    viewChannel: channel.id === targetChannel.id,
                    readMessageHistory: channel.id === targetChannel.id,
                    sendMessages: channel.id === targetChannel.id,
                });
            } catch {
                failedChannels.push(channel.name ?? channel.id);
            }
        }

        embed.setDescription(
            `🔒 Role <@&${role.id}> is now restricted:\n\n` +
                `- ✅ Can view & send messages in: <#${targetChannel.id}>\n` +
                `- ❌ Cannot access any other channels.` +
                (failedChannels.length
                    ? `\n\n⚠️ Failed to update some channels: ${failedChannels.join(
                          ", "
                      )}`
                    : "")
        );

        await interaction.editReply({ embeds: [embed] });
        return;
    }
}
