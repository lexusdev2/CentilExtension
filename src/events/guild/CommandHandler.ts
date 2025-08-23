import {
    ChatInputCommandInteraction,
    Collection,
    EmbedBuilder,
    Events,
} from "discord.js";
import _Client from "@classes/_Client";
import Event from "@classes/Events";

/**
 * @class CommandHandler
 * @extends Event
 * @description Handles all incoming slash command interactions,
 * including subcommands and cooldown logic.
 */
export default class CommandHandler extends Event {
    constructor(client: _Client) {
        super(client, {
            name: Events.InteractionCreate,
            description: "Processes all incoming slash command interactions.",
            once: false,
        });
    }

    /**
     * @method Execute
     * @param interaction ChatInputCommandInteraction
     * @description Routes the interaction to its corresponding command or subcommand,
     * and manages cooldowns for each command.
     */
    async Execute(interaction: ChatInputCommandInteraction) {
        let embed = new EmbedBuilder().setColor(0x242429);

        if (!interaction.isChatInputCommand()) return;

        const command = this.client.Commands.get(interaction.commandName);
        if (!command) {
            embed.setDescription(
                "❌ The requested command could not be found."
            );
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (
            command.dev &&
            !this.client.config?.devUserId?.includes(interaction.user.id)
        )
            embed.setDescription(
                "⚠️ This command is restricted to development users."
            );

        const now = Date.now();
        const cooldowns =
            this.client.cooldown.get(command.name) ?? new Collection();
        this.client.cooldown.set(command.name, cooldowns);

        const cooldownMs = (command.cooldown ?? 3) * 1000;
        const expiresAt = cooldowns.get(interaction.user.id) ?? 0;

        if (now < expiresAt) {
            const secondsLeft = Math.ceil((expiresAt - now) / 1000);
            embed.setDescription(
                `⏳ Please wait \`${secondsLeft}\` more second(s) before reusing the \`/${command.name}\` command.`
            );
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        cooldowns.set(interaction.user.id, now + cooldownMs);
        setTimeout(() => cooldowns.delete(interaction.user.id), cooldownMs);

        try {
            const group = interaction.options.getSubcommandGroup(false);
            const sub = interaction.options.getSubcommand(false);

            if (sub) {
                const key = group
                    ? `${interaction.commandName} ${group}.${sub}`
                    : `${interaction.commandName}.${sub}`;

                const subCommand = this.client.subCommands.get(key);
                if (subCommand) return subCommand.Execute(interaction);
            }

            return command.Execute(interaction);
        } catch (err) {
            console.error(
                "❌ An unexpected error occurred during command execution:",
                err
            );
            embed.setDescription(
                "❌ An unexpected error occurred while attempting to execute this command."
            );
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}
