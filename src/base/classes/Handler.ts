import IHandler from "@interfaces/IHandler";
import path from "path";
import { glob } from "glob";
import _Client from "@classes/_Client";
import Event from "@classes/Events";
import Command from "@classes/Command";

//@ts-ignore
import { InteractionEventManager } from 'reciple-interaction-events'

/**
 * @typedef {import("discord.js").Client} Client
 * @typedef {import("../interfaces/ICommand").default} Command
 * @class Handler
 * @description This class is used to handle the loading of events and commands.
 */
export default class Handler implements IHandler {
    client: _Client;

    constructor(client: _Client) {
        this.client = client;
    }

    /**
     * Load all events from the events folder.
     * @returns {Promise<void>}
     */
    async LoadEvents() {
        const files = (await glob(`dist/events/**/*.js`)).map((filePath) =>
            path.resolve(filePath)
        );

        for (const file of files) {
            const mod = await import(file);
            const EventClass = mod.default;

            if (typeof EventClass !== "function") {
                console.warn(
                    `[Event Loader] Skipped: ${file} (no valid class export)`
                );
                continue;
            }

            const event: Event = new EventClass(this.client);

            if (!event.name) {
                delete require.cache[require.resolve(file)];
                console.log(
                    `[Event Loader] Missing name: ${file.split("/").pop()}`
                );
                continue;
            }

            const execute = (...args: any[]) => event.Execute(...args);

            // @ts-ignore
            if (event.once) this.client.once(event.name, execute);
            // @ts-ignore
            else this.client.on(event.name, execute);

            delete require.cache[require.resolve(file)];
        }
    }

    /**
     * Load all commands from the commands folder.
     * @returns {Promise<void>}
     */
    async LoadCommands() {
        const files = (await glob(`dist/commands/**/*.js`)).map((filePath) =>
            path.resolve(filePath)
        );

        for (const file of files) {
            const mod = await import(file);
            const CommandClass = mod.default;

            if (typeof CommandClass !== "function") {
                console.warn(
                    `[Command Loader] Skipped: ${file} (no valid class export)`
                );
                continue;
            }

            const command: Command = new CommandClass(this.client);

            if (!command.name) {
                delete require.cache[require.resolve(file)];
                console.log(
                    `[Command Loader] Missing name: ${file.split("/").pop()}`
                );
                continue;
            }

            const isSubCommand = file.split("/").pop()?.split(".")[2];

            if (isSubCommand) {
                this.client.subCommands.set(command.name, command);
            } else {
                this.client.Commands.set(command.name, command as Command);
            }

            delete require.cache[require.resolve(file)];
        }
    }
}


