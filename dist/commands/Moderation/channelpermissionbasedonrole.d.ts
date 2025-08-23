import { ChatInputCommandInteraction, AutocompleteInteraction } from "discord.js";
import Command from "@classes/Command";
export default class ChannelPermissionManager extends Command {
    /**
     * Creates a new ChannelPermissionManager command instance.
     * @param client The Discord client instance.
     */
    constructor(client: any);
    /**
     * Parses a comma-separated permissions string into an array of valid permission keys.
     * @param permString Permissions string, comma separated.
     * @returns Array of valid permission keys.
     */
    private parsePermissions;
    /**
     * Handles the autocomplete interaction for permission option.
     * Suggests permission flags that start with the current input.
     * @param interaction AutocompleteInteraction instance.
     */
    autocomplete(interaction: AutocompleteInteraction): Promise<void>;
    /**
     * Executes the command with the given interaction.
     * @param interaction The ChatInputCommandInteraction instance.
     */
    Execute(interaction: ChatInputCommandInteraction): Promise<import("discord.js").Message<boolean>>;
}
