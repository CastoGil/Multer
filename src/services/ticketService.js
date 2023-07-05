import { cartRepository } from "../repositories/cartRepository.js";
import { ticketRepository } from "../repositories/ticketRepository.js";
import productRepository from "../repositories/productRepository.js";

export const ticketService = {
  getCartByIdproduct: async (cartId) => {
    const cart = await cartRepository.getCartByIdproduct(cartId);
    return cart;
  },
  checkProductsStock: async (cart) => {
    const unavailableProducts = [];
    let total = 0;
    for (const item of cart.products) {
      const product = await productRepository.getProductById(item._id);
      const quantity = item.quantity;
      if (!product) {
        continue;
      }
      total += product.price * quantity;

      if (product.stock < quantity) {
        unavailableProducts.push(item._id);
      } else {
        product.stock -= quantity;
        await product.save({ suppressWarning: true });
      }
    }
    return { unavailableProducts, total };
  },
  createTicket: async (purchaser, amount) => {
    const ticket = await ticketRepository.createTicket(purchaser, amount);
    return ticket;
  },
};
