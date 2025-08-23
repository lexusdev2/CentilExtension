import {
    ChatInputCommandInteraction,
    PermissionsBitField,
    EmbedBuilder,
} from "discord.js";
import Command from "@classes/Command";
import Category from "@enums/Category";

export default class Shuffle extends Command {
    constructor(client: any) {
        super(client, {
            name: "shuffle",
            description: "Shuffles the queue.",
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
                .setTitle("Shuffle Queue")
                .setDescription("❌ Nothing is currently playing.");
            return interaction.editReply({ embeds: [embed] });
        }

        if (!player.queue.length) {
            embed
                .setTitle("Queue Empty")
                .setDescription("❌ Not enough tracks to shuffle.");
            return interaction.editReply({ embeds: [embed] });
        }

        player.queue.shuffle();
        embed
            .setTitle("Queue Shuffled")
            .setDescription("🔀 Successfully shuffled the queue.");
        return interaction.editReply({ embeds: [embed] });
    }
}
