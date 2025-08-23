import _Client from "@classes/_Client";
import Command from "@classes/Command";
import Category from "@enums/Category";
//@ts-ignore
import Types from "@enums/Types";

import { ChatInputCommandInteraction, PermissionsBitField } from "discord.js";

export default class Editor extends Command {
    constructor(client: _Client) {
        super(client, {
            name: "editor",
            description: "Opens an editor.",
            dev: false,
            DefaultMemberPermissions: PermissionsBitField.Flags.Administrator,
            dmPermission: true,
            category: Category.Developer,
            cooldown: 2,
            options: [],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction): Promise<void> {}
}
