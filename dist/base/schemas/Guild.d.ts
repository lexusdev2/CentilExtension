import { Document } from "mongoose";
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
export declare const Guild: import("mongoose").Model<IGuild, {}, {}, {}, Document<unknown, {}, IGuild, {}> & IGuild & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Guild;
