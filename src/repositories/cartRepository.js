import { CartDAO } from "../Dao/carts/cartDao.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
const cartDAO = new CartDAO();

export const cartRepository = {
  createCart: async () => {
    try {
      const newCart = await cartDAO.createCart();
      return newCart;
    } catch (error) {
      throw new CustomError({
        name: "Database Error",
        cause: "Failed to created cart",
        code: EErrors.DATABASE_ERROR,
        message:"Error in communication with repository database create Cart"
      });
    }
  },
  getCartById: async (cartId) => {
    try {
      const cart = await cartDAO.getCartById(cartId);
      return cart;
    } catch (error) {
      throw new CustomError({
        name: "Database Error",
        cause: "Failed to get cart by id",
        code: EErrors.DATABASE_ERROR,
        message:"Error in communication with repository database get CART BY ID"
      });
    }
  },
  addProductToCart: async (cartId, productId) => {
    try {
      const cart = await cartDAO.addProductToCart(cartId, productId);
      return cart;
    } catch (error) {
      throw new CustomError({
        name: "Database Error",
        cause: "Failed to add product to cart",
        code: EErrors.DATABASE_ERROR,
        message:"Error in communication with repository database add product to cart"
      });
    }
  },
  deleteProductFromCart: async (cartId, productId) => {
    try {
      const cart = await cartDAO.deleteProductFromCart(cartId, productId);
      return cart;
    } catch (error) {
      throw new CustomError({
        name: "Database Error",
        cause: "Failed to delete product",
        code: EErrors.DATABASE_ERROR,
        message:"Error in communication with repository database delete product from cart"
      });
    }
  },
  updateCart: async (cartId, updateData) => {
    try {
      const cart = await cartDAO.updateCart(cartId, updateData);
      return cart;
    } catch (error) {
      throw new CustomError({
        name: "Database Error",
        cause: "Failed to update cart",
        code: EErrors.DATABASE_ERROR,
        message:"Error in communication with repository database update cart"
      });
    }
  },

  updateProductQuantityInCart: async (cartId, productId, quantity) => {
    try {
      const cart = await cartDAO.updateProductQuantityInCart(
        cartId,
        productId,
        quantity
      );
      return cart;
    } catch (error) {
      throw new CustomError({
        name: "Database Error",
        cause: "Failed to update product quantity",
        code: EErrors.DATABASE_ERROR,
        message:"Error in communication with repository database update product quantity in cart"
      });
    }
  },
  deleteAllProductsFromCart: async (cartId) => {
    try {
      const cart = await cartDAO.deleteAllProductsFromCart(cartId);
      return cart;
    } catch (error) {
      throw new CustomError({
        name: "Database Error",
        cause: "Failed to delete all products",
        code: EErrors.DATABASE_ERROR,
        message:"Error in communication with repository database delete all products from cart"
      });
    }
  },
  getCartByIdproduct: async (cartId) => {
    try {
      const cart = await cartDAO.getCartByIdproduct(cartId);
      return cart;
    } catch (error) {
      throw new CustomError({
        name: "Database Error",
        cause: "Failed to get cart by id product",
        code: EErrors.DATABASE_ERROR,
        message:"Error in communication with repository database get cart by id product"
      });
    }
  },
};
