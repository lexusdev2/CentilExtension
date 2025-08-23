"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    username: { type: String, required: true },
    avatarHash: { type: String, default: null },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
}, { timestamps: true });
exports.User = (0, mongoose_1.model)("User", userSchema);
exports.default = exports.User;
