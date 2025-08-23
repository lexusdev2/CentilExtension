import { Events } from "discord.js";
import _Client from "@classes/_Client";
import IEventOptions from "@interfaces/IEventOptions";
import IEvent from "@interfaces/IEvent";

export default class Event implements IEvent {
    client: _Client;
    name: Events;
    description: string;
    once?: boolean;

    constructor(client: _Client, options: IEventOptions) {
        this.client = client;
        this.name = options.name;
        this.description = options.description;
        this.once = options.once;
    }

    Execute(...args: any[]): void {}
}
