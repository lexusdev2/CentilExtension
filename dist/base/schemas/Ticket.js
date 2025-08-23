"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticket = void 0;
const mongoose_1 = require("mongoose");
const crypto_1 = require("crypto");
const ticketSchema = new mongoose_1.Schema({
    id: { type: String, default: crypto_1.randomUUID },
    guildId: { type: String, required: true },
    ownerId: { type: String, required: true },
    reason: { type: String, default: null },
    claimerId: { type: String, default: null },
    status: {
        type: String,
        enum: ["OPEN", "CLOSED", "DELETED"],
        default: "OPEN",
    },
}, { timestamps: true });
exports.Ticket = (0, mongoose_1.model)("Ticket", ticketSchema);
exports.default = exports.Ticket;
