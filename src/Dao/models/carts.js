import mongoose from "mongoose";
const cartCollection = "carts";
const cartSchema = new mongoose.Schema({
  products: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: { type: Number, default: 0, required: true },
    },
  ],
});
export const cartModel = mongoose.model(cartCollection, cartSchema);
