interface note {
    usr: string;
    id: string;

    note: string;
    createdAt: Date;

    caseId: string;
    moderatorId: string;
    tags: string[];
}

import { Schema, model } from "mongoose";

export const NoteSchema = new Schema<note>({
    usr: { type: String, required: true },
    id: { type: String, required: true },

    note: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },

    caseId: { type: String, required: true },
    tags: { type: [String], default: [] },
});

export const NoteModel = model<note>("Note", NoteSchema);
