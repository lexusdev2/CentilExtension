import IHandler from "@interfaces/IHandler";
import _Client from "@classes/_Client";
/**
 * @typedef {import("discord.js").Client} Client
 * @typedef {import("../interfaces/ICommand").default} Command
 * @class Handler
 * @description This class is used to handle the loading of events and commands.
 */
export default class Handler implements IHandler {
    client: _Client;
    constructor(client: _Client);
    /**
     * Load all events from the events folder.
     * @returns {Promise<void>}
     */
    LoadEvents(): Promise<void>;
    /**
     * Load all commands from the commands folder.
     * @returns {Promise<void>}
     */
    LoadCommands(): Promise<void>;
}
