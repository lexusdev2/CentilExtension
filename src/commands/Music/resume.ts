import {
    ChatInputCommandInteraction,
    PermissionsBitField,
    EmbedBuilder,
} from "discord.js";
import Command from "@classes/Command";
import Category from "@enums/Category";

export default class Resume extends Command {
    constructor(client: any) {
        super(client, {
            name: "resume",
            description: "Resumes the music.",
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
                .setTitle("Resume Playback")
                .setDescription("❌ Nothing is currently playing.");
            return interaction.editReply({ embeds: [embed] });
        }

        if (!player.paused) {
            embed
                .setTitle("Already Playing")
                .setDescription("❌ The player is already playing.");
            return interaction.editReply({ embeds: [embed] });
        }

        player.pause(false);
        embed.setTitle("Music Resumed").setDescription("▶️ Resumed the music.");
        return interaction.editReply({ embeds: [embed] });
    }
}
