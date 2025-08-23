import { Events } from "discord.js";
import _Client from "@classes/_Client";
import IEventOptions from "@interfaces/IEventOptions";
import IEvent from "@interfaces/IEvent";
export default class Event implements IEvent {
    client: _Client;
    name: Events;
    description: string;
    once?: boolean;
    constructor(client: _Client, options: IEventOptions);
    Execute(...args: any[]): void;
}
