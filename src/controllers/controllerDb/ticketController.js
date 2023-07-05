import { ticketService } from "../../services/ticketService.js";
import { cartService } from "../../services/cartService.js";
import CustomError from "../../services/errors/CustomError.js";
import { generateCartIdError } from "../../services/errors/info.js";
import EErrors from "../../services/errors/enums.js";

export const ticketController = {
  purchaseCart: async (req, res,next) => {
    try {
      const cartId = req.params.cid;
      if (!cartId || typeof cartId !== "string") {
        throw new CustomError({
          name: "Invalid Types Error",
          cause: generateCartIdError({ cartId }),
          message: "Error trying to Purchase Cart",
          code: EErrors.INVALID_TYPES_ERROR,
        });
      }

      const cart = await ticketService.getCartByIdproduct(cartId);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      const { unavailableProducts, total } =
        await ticketService.checkProductsStock(cart);

      if (unavailableProducts.length > 0) {
        cart.products = cart.products.filter(
          (item) => !unavailableProducts.includes(item._id)
        );
        await cartService.updateCart(req.params.cid, cart);
        return res.status(400).json({
          message: "Some products are unavailable",
          unavailableProducts,
        });
      }
      const ticket = await ticketService.createTicket(req.user.email, total);
      await cartService.deleteAllProductsFromCart(req.params.cid);

      return res.status(200).json({ message: "Purchase completed", ticket });
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
