import { cartRepository } from "../repositories/cartRepository.js";

export const cartService = {
  createCart: async () => {
    const newCart = await cartRepository.createCart();
    return newCart;
  },
  getCartById: async (cartId) => {
    const cart = await cartRepository.getCartById(cartId);
    return cart;
  },
  addProductToCart: async (cartId, productId) => {
    const cart = await cartRepository.addProductToCart(cartId, productId);
    return cart;
  },
  deleteProductFromCart: async (cartId, productId) => {
    const cart = await cartRepository.deleteProductFromCart(cartId, productId);
    return cart;
  },
  updateCart: async (cartId, updateData) => {
    const cart = await cartRepository.updateCart(cartId, updateData);
    return cart;
  },
  updateProductQuantityInCart: async (cartId, productId, quantity) => {
    const cart = await cartRepository.updateProductQuantityInCart(
      cartId,
      productId,
      quantity
    );
    return cart;
  },
  deleteAllProductsFromCart: async (cartId) => {
    const cart = await cartRepository.deleteAllProductsFromCart(cartId);
    return cart;
  }
};
