import mongoose from "mongoose";
const ticketCollection = "Ticket";
const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  purchase_datetime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
  },
});
export const Ticket = mongoose.model(ticketCollection, ticketSchema);
