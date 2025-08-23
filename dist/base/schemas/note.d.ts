interface note {
    usr: string;
    id: string;
    note: string;
    createdAt: Date;
    caseId: string;
    moderatorId: string;
    tags: string[];
}
import { Schema } from "mongoose";
export declare const NoteSchema: Schema<note, import("mongoose").Model<note, any, any, any, import("mongoose").Document<unknown, any, note, any> & note & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, note, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<note>, {}> & import("mongoose").FlatRecord<note> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const NoteModel: import("mongoose").Model<note, {}, {}, {}, import("mongoose").Document<unknown, {}, note, {}> & note & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>;
export {};
