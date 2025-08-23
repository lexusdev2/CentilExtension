import { ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "@classes/Command";
import Category from "@enums/Category";

export default class Ping extends Command {
    constructor(client: any) {
        super(client, {
            name: "ping",
            description: "Ping Pong!",
            category: Category.Utilities,
            options: [],
            DefaultMemberPermissions:
                PermissionsBitField.Flags.UseApplicationCommands,
            dmPermission: true,
            cooldown: 3,
            dev: true,
        });
    }

    Execute(interaction: ChatInputCommandInteraction) {
        interaction.reply({
            content: `Pong! \`${this.client.ws.ping}ms\``,
            ephemeral: true,
        });
    }
}
