import {
    ChatInputCommandInteraction,
    PermissionsBitField,
    GuildMember,
    EmbedBuilder,
} from "discord.js";
import Command from "@classes/Command";
import Category from "@enums/Category";

export default class Skip extends Command {
    constructor(client: any) {
        super(client, {
            name: "skip",
            description: "Skips the currently playing track.",
            category: Category.Music,
            cooldown: 3,
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

        const member = interaction.member as GuildMember;
        const voiceChannel = member.voice?.channel;

        if (!voiceChannel) {
            embed
                .setTitle("Voice Channel Required")
                .setDescription(
                    "❌ You must be in a voice channel to use this command."
                );
            return interaction.editReply({ embeds: [embed] });
        }

        const player = client.riffy.players.get(interaction.guildId!);

        if (!player) {
            embed
                .setTitle("Nothing Playing")
                .setDescription("❌ There is no active player.");
            return interaction.editReply({ embeds: [embed] });
        }

        if (!player.queue.length) {
            embed
                .setTitle("Queue Empty")
                .setDescription("❌ No more tracks to skip to.");
            return interaction.editReply({ embeds: [embed] });
        }

        player.stop();

        embed
            .setTitle("Track Skipped")
            .setDescription("⏭️ Skipped the current track.");
        return interaction.editReply({ embeds: [embed] });
    }
}
