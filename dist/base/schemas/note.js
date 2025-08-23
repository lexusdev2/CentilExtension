"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteModel = exports.NoteSchema = void 0;
const mongoose_1 = require("mongoose");
exports.NoteSchema = new mongoose_1.Schema({
    usr: { type: String, required: true },
    id: { type: String, required: true },
    note: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    caseId: { type: String, required: true },
    tags: { type: [String], default: [] },
});
exports.NoteModel = (0, mongoose_1.model)("Note", exports.NoteSchema);
