import { ChatInputCommandInteraction, AutocompleteInteraction } from "discord.js";
import Category from "@enums/Category";
import ICommand from "@interfaces/ICommand";
import ICommandOptions from "@interfaces/ICommandOptions";
import _Client from "@classes/_Client";
export default class Command implements ICommand {
    client: _Client;
    name: string;
    description: string;
    category: Category;
    options: ICommandOptions["options"];
    DefaultMemberPermissions: bigint;
    dmPermission: boolean;
    cooldown: number;
    dev: boolean;
    constructor(client: _Client, options: ICommandOptions);
    Execute(interaction: ChatInputCommandInteraction): void;
    AutoComplete(interaction: AutocompleteInteraction): void;
}
