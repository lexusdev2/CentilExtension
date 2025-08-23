import {
    ChatInputCommandInteraction,
    PermissionsBitField,

    // @ts-ignore
    GuildMember,
    EmbedBuilder,
} from "discord.js";
import Command from "@classes/Command";
import Category from "@enums/Category";

export default class Status extends Command {
    constructor(client: any) {
        super(client, {
            name: "status",
            description: "Displays the current player status.",
            category: Category.Music,
            cooldown: 0,
            dmPermission: false,
            dev: false,
            DefaultMemberPermissions: PermissionsBitField.Flags.Connect,
            options: [],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const client = this.client;
        const embed = new EmbedBuilder().setColor(0x2b2d31).setTimestamp();
        await interaction.deferReply({ ephemeral: true });

        const player = client.riffy.players.get(interaction.guildId!);

        if (!player) {
            embed
                .setTitle("Player Not Found")
                .setDescription("❌ No active player found.");
            return interaction.editReply({ embeds: [embed] });
        }

        const currentTrack = player.current;

        embed.setTitle("🎧 Player Status").addFields(
            {
                name: "Now Playing",
                value: currentTrack?.info?.title || "Nothing",
                inline: true,
            },
            {
                name: "Paused",
                value: player.paused ? "Yes" : "No",
                inline: true,
            },
            {
                name: "Looping",
                value: typeof player.loop === "string" ? player.loop : "none",
                inline: true,
            },
            {
                name: "Volume",
                value: `${player.volume}%`,
                inline: true,
            }
        );

        return interaction.editReply({ embeds: [embed] });
    }
}
