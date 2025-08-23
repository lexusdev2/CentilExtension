import { Schema, model, Document } from "mongoose";

export interface IGuild extends Document {
    id: string;
    name: string;
    iconHash: string | null;
    openTicketsCategoryId: string | null;
    closedTicketsCategoryId: string | null;
    transcriptsChannelId: string | null;
    modRoleIds: string[];
    pingRoleIds: string[];
    createdAt: Date;
    updatedAt: Date;
}

const guildSchema = new Schema<IGuild>(
    {
        id: { type: String, required: true },
        name: { type: String, required: true },
        iconHash: { type: String, default: null },
        openTicketsCategoryId: { type: String, default: null },
        closedTicketsCategoryId: { type: String, default: null },
        transcriptsChannelId: { type: String, default: null },
        modRoleIds: { type: [String], default: [] },
        pingRoleIds: { type: [String], default: [] },
    },
    { timestamps: true }
);

export const Guild = model<IGuild>("Guild", guildSchema);
export default Guild;
