import { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import _Client from "@classes/_Client";
import Category from "@enums/Category";

export default interface ICommand {
    client: _Client;
    name: string;
    description: string;
    category: Category;
    options: object;
    DefaultMemberPermissions: bigint;
    dmPermission: boolean;
    cooldown: number;
    dev: boolean;

    Execute(interaction: ChatInputCommandInteraction): void;
    AutoComplete(interaction: AutocompleteInteraction): void;


}