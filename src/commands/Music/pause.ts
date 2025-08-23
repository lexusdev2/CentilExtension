import {
    ChatInputCommandInteraction,
    PermissionsBitField,
    EmbedBuilder,
} from "discord.js";
import Command from "@classes/Command";
import Category from "@enums/Category";

export default class Pause extends Command {
    constructor(client: any) {
        super(client, {
            name: "pause",
            description: "Pauses the currently playing music.",
            category: Category.Music,
            options: [],
            cooldown: 2,
            DefaultMemberPermissions: PermissionsBitField.Flags.Connect,
            dmPermission: false,
            dev: false,
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const client = this.client;
        const embed = new EmbedBuilder().setColor(0x2b2d31).setTimestamp();

        await interaction.deferReply({ ephemeral: true });

        const player = client.riffy.players.get(interaction.guildId!);

        if (!player || !player.current) {
            embed
                .setTitle("Unable to Pause")
                .setDescription("❌ Nothing is currently playing.");
            return interaction.editReply({ embeds: [embed] });
        }

        if (player.paused) {
            embed
                .setTitle("Already Paused")
                .setDescription("❌ The player is already paused.");
            return interaction.editReply({ embeds: [embed] });
        }

        player.pause(true);

        const track = player.current;
        const thumbnailUrl = `https://img.youtube.com/vi/${track.info.identifier}/hqdefault.jpg`;

        embed
            .setTitle("⏸️ Music Paused")
            .setDescription(`[${track.info.title}](${track.info.uri})`)
            .addFields({
                name: "Requested by",
                value: `<@${track.info.requester?.id || interaction.user.id}>`,
                inline: true,
            })
            .setThumbnail(thumbnailUrl);

        return interaction.editReply({ embeds: [embed] });
    }
}
