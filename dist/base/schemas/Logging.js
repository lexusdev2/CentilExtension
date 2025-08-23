"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingModel = exports.LoggingSchema = void 0;
const mongoose_1 = require("mongoose");
exports.LoggingSchema = new mongoose_1.Schema({
    usrTag: { type: String, required: false },
    usrName: { type: String, required: false },
    usrId: { type: String, required: false },
    stffTag: { type: String, required: false },
    stffName: { type: String, required: false },
    stffId: { type: String, required: false },
    action: { type: String, required: false },
    reason: { type: String, required: false },
    silent: { type: Boolean, default: false },
    dm: { type: Boolean, default: true },
    timestamp: { type: Date, default: Date.now },
    channelId: { type: String, required: false },
    gldId: { type: String, required: false },
    gldName: { type: String, required: false },
    gldIcon: { type: String, required: false },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    caseId: { type: String, required: true },
});
exports.LoggingModel = (0, mongoose_1.model)("Logging", exports.LoggingSchema);
