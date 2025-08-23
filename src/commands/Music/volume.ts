import {
    ChatInputCommandInteraction,
    PermissionsBitField,
    EmbedBuilder,
} from "discord.js";
import Command from "@classes/Command";
import Category from "@enums/Category";
import Types from "@enums/Types";

export default class Volume extends Command {
    constructor(client: any) {
        super(client, {
            name: "volume",
            description: "Adjusts the volume of the player.",
            category: Category.Music,
            cooldown: 5,
            dmPermission: false,
            dev: false,
            DefaultMemberPermissions: PermissionsBitField.Flags.Connect,
            options: [
                {
                    name: "level",
                    description: "Volume level (0–100).",
                    type: Types.Integer,
                    required: true,
                },
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const volume = interaction.options.getInteger("level", true);
        const client = this.client;
        const embed = new EmbedBuilder().setColor(0x2b2d31).setTimestamp();

        await interaction.deferReply({ ephemeral: true });

        if (isNaN(volume) || volume < 0 || volume > 100) {
            embed
                .setTitle("Invalid Volume")
                .setDescription("❌ Volume must be between 0 and 100.");
            return interaction.editReply({ embeds: [embed] });
        }

        const player = client.riffy.players.get(interaction.guildId!);
        if (!player) {
            embed
                .setTitle("No Player")
                .setDescription("❌ Nothing is currently playing.");
            return interaction.editReply({ embeds: [embed] });
        }

        player.setVolume(volume);
        embed
            .setTitle("🔊 Volume Changed")
            .setDescription(`Volume set to **${volume}%**`);
        return interaction.editReply({ embeds: [embed] });
    }
}
