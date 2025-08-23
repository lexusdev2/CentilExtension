import _Client from "@classes/_Client";
import Command from "@classes/Command";
import Category from "@enums/Category";
import Types from "@enums/Types";

import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    Events,
    GuildMember,
    PermissionsBitField,
    TextChannel,
} from "discord.js";

export default class Emit extends Command {
    constructor(client: _Client) {
        super(client, {
            name: "emit",
            description: "Manually emit a Discord event for testing purposes.",
            dev: false,
            DefaultMemberPermissions: PermissionsBitField.Flags.Administrator,
            dmPermission: true,
            category: Category.Developer,
            cooldown: 2,
            options: [
                {
                    name: "event",
                    description: "The Discord event to emit (limited to 25).",
                    required: true,
                    type: Types.String,
                    choices: [
                        { name: "GuildCreate", value: Events.GuildCreate },
                        { name: "GuildDelete", value: Events.GuildDelete },
                        { name: "ChannelCreate", value: Events.ChannelCreate },
                        { name: "ChannelDelete", value: Events.ChannelDelete },
                        { name: "ChannelUpdate", value: Events.ChannelUpdate },
                        { name: "MessageCreate", value: Events.MessageCreate },
                        { name: "MessageDelete", value: Events.MessageDelete },
                        { name: "MessageUpdate", value: Events.MessageUpdate },
                        {
                            name: "GuildMemberAdd",
                            value: Events.GuildMemberAdd,
                        },
                        {
                            name: "GuildMemberRemove",
                            value: Events.GuildMemberRemove,
                        },
                        {
                            name: "GuildMemberUpdate",
                            value: Events.GuildMemberUpdate,
                        },
                        {
                            name: "PresenceUpdate",
                            value: Events.PresenceUpdate,
                        },
                        {
                            name: "VoiceStateUpdate",
                            value: Events.VoiceStateUpdate,
                        },
                        { name: "GuildBanAdd", value: Events.GuildBanAdd },
                        {
                            name: "GuildBanRemove",
                            value: Events.GuildBanRemove,
                        },
                        { name: "InviteCreate", value: Events.InviteCreate },
                        { name: "InviteDelete", value: Events.InviteDelete },
                        { name: "ThreadCreate", value: Events.ThreadCreate },
                        { name: "ThreadDelete", value: Events.ThreadDelete },
                        { name: "ThreadUpdate", value: Events.ThreadUpdate },
                        { name: "UserUpdate", value: Events.UserUpdate },
                        {
                            name: "InteractionCreate",
                            value: Events.InteractionCreate,
                        },
                        {
                            name: "GuildRoleCreate",
                            value: Events.GuildRoleCreate,
                        },
                        {
                            name: "GuildRoleDelete",
                            value: Events.GuildRoleDelete,
                        },
                        {
                            name: "GuildRoleUpdate",
                            value: Events.GuildRoleUpdate,
                        },
                    ],
                },
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const event = interaction.options.getString("event", true);
        const embed = new EmbedBuilder().setColor(0x242429).setTimestamp();

        await interaction.deferReply({ ephemeral: true });

        const guild = interaction.guild;
        const member =
            interaction.member instanceof GuildMember
                ? interaction.member
                : null;
        const channel =
            interaction.channel instanceof TextChannel
                ? interaction.channel
                : null;

        switch (event) {
            case Events.GuildCreate:
            case Events.GuildDelete:
                if (guild) this.client.emit(event, guild);
                break;

            case Events.ChannelCreate:
            case Events.ChannelDelete:
                if (channel) this.client.emit(event, channel);
                break;

            case Events.ChannelUpdate:
                if (channel) this.client.emit(event, channel, channel);
                break;

            case Events.MessageCreate:
            case Events.MessageDelete:
                if (channel) {
                    const messages = await channel.messages.fetch({ limit: 1 });
                    const msg = messages.first();
                    if (msg) this.client.emit(event, msg);
                }
                break;

            case Events.MessageUpdate:
                if (channel) {
                    const messages = await channel.messages.fetch({ limit: 1 });
                    const msg = messages.first();
                    if (msg) this.client.emit(event, msg, msg);
                }
                break;

            case Events.GuildMemberAdd:
            case Events.GuildMemberRemove:
                if (member) this.client.emit(event, member);
                break;

            case Events.GuildMemberUpdate:
                if (member) this.client.emit(event, member, member);
                break;

            case Events.PresenceUpdate:
                if (member && member.presence) {
                    this.client.emit(event, member.presence, member.presence);
                }
                break;

            case Events.VoiceStateUpdate:
                if (member && member.voice) {
                    this.client.emit(event, member.voice, member.voice);
                }
                break;

            case Events.GuildBanAdd:
            case Events.GuildBanRemove:
            case Events.InviteCreate:
            case Events.InviteDelete:
            case Events.ThreadCreate:
            case Events.ThreadDelete:
            case Events.ThreadUpdate:
            case Events.UserUpdate:
            case Events.InteractionCreate:
            case Events.GuildRoleCreate:
            case Events.GuildRoleDelete:
            case Events.GuildRoleUpdate:
                embed.setDescription(
                    `⚠️ The event \`${event}\` is valid but not handled specifically.`
                );
                await interaction.editReply({ embeds: [embed] });
                return;

            default:
                embed.setDescription(`❌ Unknown event: \`${event}\`.`);
                await interaction.editReply({ embeds: [embed] });
                return;
        }

        embed.setDescription(`✅ Successfully emitted event: \`${event}\``);
        await interaction.editReply({ embeds: [embed] });
    }
}
