"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const GuildSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    ownerId: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        default: null,
    },
    claimerId: {
        type: String,
        default: null,
    }
}, {
    timestamps: true,
    versionKey: true,
    safe: true,
    minimize: false,
    id: false,
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {
            delete ret._id;
            return ret;
        },
    },
});
module.exports = (0, mongoose_1.model)("GuildSchema", GuildSchema);
exports.default = GuildSchema;
