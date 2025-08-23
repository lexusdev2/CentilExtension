"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(client, options) {
        this.client = client;
        this.name = options.name;
        this.description = options.description;
        this.category = options.category;
        this.options = options.options;
        this.DefaultMemberPermissions = options.DefaultMemberPermissions;
        this.dmPermission = options.dmPermission;
        this.cooldown = options.cooldown;
        this.dev = options.dev;
    }
    Execute(interaction) { }
    AutoComplete(interaction) {
        throw new Error("Method not implemented.");
    }
}
exports.default = Command;
