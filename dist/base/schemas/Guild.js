"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guild = void 0;
const mongoose_1 = require("mongoose");
const guildSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    iconHash: { type: String, default: null },
    openTicketsCategoryId: { type: String, default: null },
    closedTicketsCategoryId: { type: String, default: null },
    transcriptsChannelId: { type: String, default: null },
    modRoleIds: { type: [String], default: [] },
    pingRoleIds: { type: [String], default: [] },
}, { timestamps: true });
exports.Guild = (0, mongoose_1.model)("Guild", guildSchema);
exports.default = exports.Guild;
