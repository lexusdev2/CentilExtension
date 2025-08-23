import { Document } from "mongoose";
export interface ITicket extends Document {
    id: string;
    guildId: string;
    ownerId: string;
    reason: string | null;
    claimerId: string | null;
    status: "OPEN" | "CLOSED" | "DELETED";
    createdAt: Date;
    updatedAt: Date;
}
export declare const Ticket: import("mongoose").Model<ITicket, {}, {}, {}, Document<unknown, {}, ITicket, {}> & ITicket & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Ticket;
