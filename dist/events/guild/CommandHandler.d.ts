import { ChatInputCommandInteraction } from "discord.js";
import _Client from "@classes/_Client";
import Event from "@classes/Events";
/**
 * @class CommandHandler
 * @extends Event
 * @description Handles all incoming slash command interactions,
 * including subcommands and cooldown logic.
 */
export default class CommandHandler extends Event {
    constructor(client: _Client);
    /**
     * @method Execute
     * @param interaction ChatInputCommandInteraction
     * @description Routes the interaction to its corresponding command or subcommand,
     * and manages cooldowns for each command.
     */
    Execute(interaction: ChatInputCommandInteraction): Promise<void | import("discord.js").InteractionResponse<boolean>>;
}
