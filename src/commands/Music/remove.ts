import {
    ChatInputCommandInteraction,
    PermissionsBitField,
    EmbedBuilder,
} from "discord.js";
import Command from "@classes/Command";
import Category from "@enums/Category";
import Types from "@enums/Types";

export default class Remove extends Command {
    constructor(client: any) {
        super(client, {
            name: "remove",
            description: "Removes a track from the queue.",
            category: Category.Music,
            cooldown: 0,
            dmPermission: false,
            dev: false,
            DefaultMemberPermissions: PermissionsBitField.Flags.Connect,
            options: [
                {
                    name: "position",
                    description: "Position of the track to remove (starts at 1).",
                    type: Types.Integer,
                    required: true,
                },
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const client = this.client;
        const embed = new EmbedBuilder().setColor(0x2b2d31).setTimestamp();
        await interaction.deferReply({ ephemeral: true });

        const position = interaction.options.getInteger("position", true);
        const player = client.riffy.players.get(interaction.guildId!);

        if (!player || !player.queue.length) {
            embed
                .setTitle("Remove Track")
                .setDescription("❌ The queue is empty or nothing is playing.");
            return interaction.editReply({ embeds: [embed] });
        }

        if (position < 1 || position > player.queue.length) {
            embed
                .setTitle("Invalid Position")
                .setDescription(`❌ Please enter a position between 1 and ${player.queue.length}.`);
            return interaction.editReply({ embeds: [embed] });
        }

        const removed = player.queue.remove(position - 1);
        embed
            .setTitle("Track Removed")
            .setDescription(`🗑️ Removed **${removed.info.title}** from the queue.`);

        return interaction.editReply({ embeds: [embed] });
    }
}
