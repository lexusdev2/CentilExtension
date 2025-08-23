import {
    ChatInputCommandInteraction,
    PermissionsBitField,
    // @ts-ignore
    GuildMember,
} from "discord.js";
import Command from "@classes/Command";
import Category from "@enums/Category";
import { EmbedBuilder } from "@discordjs/builders";

export default class Loop extends Command {
    constructor(client: any) {
        super(client, {
            name: "loop",
            description: "Toggles queue loop mode on or off.",
            category: Category.Music,
            DefaultMemberPermissions: PermissionsBitField.Flags.Connect,
            dmPermission: false,
            options: [],
            cooldown: 0,
            dev: false,
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const client = this.client;
        const embed = new EmbedBuilder().setColor(0x2b2d31).setTimestamp();

        await interaction.deferReply({ ephemeral: true });

        const player = client.riffy.players.get(interaction.guildId!);

        if (!player) {
            embed
                .setTitle("Nothing Playing")
                .setDescription("❌ There is no active player in this server.");
            return interaction.editReply({ embeds: [embed] });
        }

        const newMode = player.loop === "none" ? "queue" : "none";
        player.setLoop(newMode);

        embed
            .setTitle("🔁 Loop Toggled")
            .setDescription(
                `${
                    newMode === "queue" ? "Enabled" : "Disabled"
                } queue loop mode.`
            )
            .addFields({
                name: "Requested by",
                value: `<@${interaction.user.id}>`,
                inline: false,
            });

        return interaction.editReply({ embeds: [embed] });
    }
}
