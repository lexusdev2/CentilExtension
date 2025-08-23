import { Schema, model, Document } from "mongoose";
import { randomUUID } from "crypto";

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

const ticketSchema = new Schema<ITicket>(
  {
    id: { type: String, default: randomUUID },
    guildId: { type: String, required: true },
    ownerId: { type: String, required: true },
    reason: { type: String, default: null },
    claimerId: { type: String, default: null },
    status: {
      type: String,
      enum: ["OPEN", "CLOSED", "DELETED"],
      default: "OPEN",
    },
  },
  { timestamps: true }
);

export const Ticket = model<ITicket>("Ticket", ticketSchema);
export default Ticket;
