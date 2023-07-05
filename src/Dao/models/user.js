import mongoose from "mongoose";
const userCollection = "users";
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  age: {
    type: Number,
  },
  password: {
    type: String,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  role: {
    type: String,
    enum: ["usuario", "premium", "admin"],
    default: "usuario",
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiration: {
    type: Date,
  },
  documents: [
    {
      name: {
        type: String,
      },
      reference: {
        type: String,
      },
      status: {
        type: String,
        default: "pendiente",
      },
    },
  ],
  last_connection:{
    type:Date,
    default: Date.now,
  }
});
export const userModel = mongoose.model(userCollection, userSchema);
