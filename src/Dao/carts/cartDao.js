import { cartModel } from "../models/carts.js";
import { getLogger } from "../../utils.js";
const logger = getLogger();

export class CartDAO {
  async createCart() {
    try {
      const newCart = new cartModel();
      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error("Failed to create cart");
    }
  }
  async getCartById(cartId) {
    try {
      const cart = await cartModel
        .findById(cartId)
        .populate("products._id")
        .lean()
        .exec();
      if (!cart) {
        throw new Error("Cart not found");
      }
      return cart;
    } catch (error) {
      throw new Error("Failed to get cart");
    }
  }
  async addProductToCart(cartId, productId) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw new Error("Cart not found");
      }

      const existingProduct = cart.products.findIndex(
        (product) => product.id === productId
      );

      if (existingProduct !== -1) {
        cart.products[existingProduct].quantity += 1;
      } else {
        cart.products.push({ _id: productId, quantity: 1 });
      }

      await cart.save();

      return cart;
    } catch (error) {
      throw new Error("Failed to add product to cart");
    }
  }
  async deleteProductFromCart(cartId, productId) {
    try {
      const cart = await cartModel.findOneAndUpdate(
        { _id: cartId },
        { $pull: { products: { _id: productId } } },
        { new: true }
      );
      if (!cart) {
        throw new Error("Cart not found");
      }
      if (!productId) {
        throw new Error("Product ID is required");
      }
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Failed to delete product from cart");
    }
  }
  async updateCart(cartId, updateData) {
    try {
      const cart = await cartModel.findByIdAndUpdate(
        cartId,
        { products: updateData },
        { new: true, runValidators: true, populate: { path: "products._id" } }
      );
      return cart;
    } catch (error) {
      throw error;
    }
  }
  async updateProductQuantityInCart (cartId, productId, quantity)  {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      const product = cart.products.find(
        (product) => product._id.toString() === productId
      );
      if (!product) {
        throw new Error("Producto no encontrado en el carrito");
      }
      product.quantity = quantity;
      await cart.save();
      return cart;
    } catch (error) {
      throw error;
    }
  }
  async deleteAllProductsFromCart(cartId) {
    try {
      const cart = await cartModel.findByIdAndUpdate(
        cartId,
        { products: [] },
        { new: true }
      );
      return cart;
    } catch (error) {
      throw error;
    }
  }
  async getCartByIdproduct(cartId) {
    try {
      const cart = await cartModel
        .findById(cartId)
        .populate("products._id")
        
      if (!cart) {
        throw new Error("Cart not found");
      }
      return cart;
    } catch (error) {
      throw new Error("Failed to get cart");
    }
  }
};



