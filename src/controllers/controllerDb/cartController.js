import { cartService } from "../../services/cartService.js";
import productService from "../../services/productsService.js";
import { CartDTO } from "../../Dto/cartDto.js";
import EErrors from "../../services/errors/enums.js";
import CustomError from "../../services/errors/CustomError.js";
import {
  generatePropertiesError,
  generateCartIdError,
} from "../../services/errors/info.js";
import { getLogger } from "../../utils.js";
const logger = getLogger();

export const cartController = {
  createCart: async (req, res, next) => {
    try {
      const newCart = await cartService.createCart();
      const cartDTO = new CartDTO(newCart.id, []);
      res.status(201).json(cartDTO);
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(
          new CustomError({
            name: "Database Error",
            message: "An error occurred while communicating with the database.",
            cause: error,
            code: EErrors.DATABASE_ERROR,
          })
        );
      }
    }
  },
  getCartById: async (req, res, next) => {
    try {
      const cartId = req.params.cid;
      if (!cartId || typeof cartId !== "string") {
        throw new CustomError({
          name: "Invalid ID Error",
          cause: generateCartIdError({ cartId }),
          message: "Error trying to get cart by Id",
          code: EErrors.INVALID_IDS_ERROR,
        });
      }
      const cart = await cartService.getCartById(cartId);
      const products = cart.products.map((product) => {
        const { _id, title, description, price, thumbnail, code, stock } =
          product._id;
        return {
          _id,
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          quantity: product.quantity,
        };
      });
      const cartDTO = new CartDTO(cart._id, products);
      res.status(200).json(cartDTO);
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(
          new CustomError({
            name: "Database Error",
            message: "An error occurred while communicating with the database.",
            cause: error,
            code: EErrors.DATABASE_ERROR,
          })
        );
      }
    }
  },
  addProductToCart: async (req, res, next) => {
    try {
      const { cid, pid } = req.params;
      if (!cid || !pid || typeof cid !== "string" || typeof pid !== "string") {
        throw new CustomError({
          name: "Invalid Ids Error",
          cause: generatePropertiesError({ cid, pid }),
          message: "Error trying to add Product to cart",
          code: EErrors.INVALID_IDS_ERROR,
        });
      }
      const product = await productService.getProductById(pid);
      if (
        req.user.role === "admin" ||
        (req.user.role === "premium" && product.owner !== req.user.email)
      ) {
        const cart = await cartService.addProductToCart(cid, pid);
        const products = cart.products.map((product) => ({
          id: product._id,
          quantity: product.quantity,
        }));
        const cartDTO = new CartDTO(cart.id, products);
        res.status(200).json(cartDTO);
      } else {
        throw new CustomError({
          name: "Unauthorized Error",
          message: "You are not authorized to add this product to your cart",
          code: EErrors.UNAUTHORIZED_ERROR,
          cause: `Product owner: ${product.owner}, User email: ${req.user.email}`,
        });
      }
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        const customError = new CustomError({
          name: "Database Error",
          cause: error,
          message: error.message,
          code: EErrors.DATABASE_ERROR,
        });
        next(customError);
      }
    }
  },

  deleteProductFromCart: async (req, res, next) => {
    try {
      const { cid, pid } = req.params;
      if (!cid || !pid || typeof cid !== "string" || typeof pid !== "string") {
        throw new CustomError({
          name: "Invalid IDS Error",
          cause: generatePropertiesError({ cid, pid }),
          message: "Error trying to delete Product from Cart",
          code: EErrors.INVALID_IDS_ERROR,
        });
      }
      const cart = await cartService.deleteProductFromCart(cid, pid);
      const products = cart.products.map((product) => ({
        id: product._id,
        quantity: product.quantity,
      }));
      const cartDTO = new CartDTO(cart.id, products);
      res.status(200).json(cartDTO);
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(
          new CustomError({
            name: "Database Error",
            message: "An error occurred while communicating with the database.",
            cause: error,
            code: EErrors.DATABASE_ERROR,
          })
        );
      }
    }
  },

  updateCart: async (req, res, next) => {
    try {
      const cartId = req.params.cid;
      const updateData = req.body.products;
      console.log("controller",req.params.cid)
      if (!cartId || typeof cartId !== "string") {
        throw new CustomError({
          name: "Invalid Id Error",
          cause: generateCartIdError({ cartId }),
          message: "Error trying to update Cart",
          code: EErrors.INVALID_IDS_ERROR,
        });
      }
      const cart = await cartService.updateCart(cartId, updateData);
      const products = cart.products.map((product) => {
        const { _id, title, description, price, thumbnail, code, stock } =
          product._id;
        return {
          _id,
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          quantity: product.quantity,
        };
      });
      const cartDTO = new CartDTO(cart._id, products);
      res.status(200).json(cartDTO);
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(
          new CustomError({
            name: "Database Error",
            message: "An error occurred while communicating with the database.",
            cause: error,
            code: EErrors.DATABASE_ERROR,
          })
        );
      }
    }
  },
  updateProductQuantityInCart: async (req, res, next) => {
    try {
      const { cid, pid } = req.params;
      console.log(req.params)
      if (!cid || !pid || typeof cid !== "string" || typeof pid !== "string") {
        throw new CustomError({
          name: "Invalid IDS Error",
          cause: generatePropertiesError({ cid, pid }),
          message: "Error trying to update Product quantity in cart",
          code: EErrors.INVALID_IDS_ERROR,
        });
      }
      const { quantity } = req.body;
      const cart = await cartService.updateProductQuantityInCart(
        cid,
        pid,
        quantity
      );
      const products = cart.products.map((product) => ({
        id: product._id,
        quantity: product.quantity,
      }));
      const cartDTO = new CartDTO(cart.id, products);
      res.status(200).json(cartDTO);
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {

        next(
          new CustomError({
            name: "Database Error",
            message: "An error occurred while communicating with the database.",
            cause: error,
            code: EErrors.DATABASE_ERROR,
          })
        );
      }
    }
  },
  deleteAllProductsCart: async (req, res, next) => {
    try {
      const { cid } = req.params;
      if (!cid || typeof cid !== "string") {
        throw new CustomError({
          name: "Invalid Id Error",
          cause: generateCartIdError({ cid }),
          message: "Error trying to delete all Products Cart",
          code: EErrors.INVALID_IDS_ERROR,
        });
      }
      const cart = await cartService.deleteAllProductsFromCart(cid);
      const cartDTO = new CartDTO(cart.id, []);
      res.status(200).json(cartDTO);
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(
          new CustomError({
            name: "Database Error",
            message: "An error occurred while communicating with the database.",
            cause: error,
            code: EErrors.DATABASE_ERROR,
          })
        );
      }
    }
  },
};
