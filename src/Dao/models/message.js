import mongoose from "mongoose";
const messageCollection = "messages";
const messageSchema = new mongoose.Schema({
  user: { type: String, unique: true },
  message: String,
  created_at:{
    type: Date,
    default: Date.now
  }
});
export const messageModel = mongoose.model(messageCollection, messageSchema);