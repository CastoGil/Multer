import express from "express";
import { cartController } from "../controllers/controllerDb/cartController.js";
import { admin, authorize } from "../middlewares/index.js";
import { ticketController } from "../controllers/controllerDb/ticketController.js";
import passport from "passport";
const router = express.Router();

///////////////////Ruta de Carrito////////////////////////////
router.post("/", cartController.createCart);
router.get("/:cid", cartController.getCartById);
router.post(
  "/:cid/products/:pid",
  admin,
  authorize,
  cartController.addProductToCart
);
router.delete("/:cid/products/:pid", cartController.deleteProductFromCart);
router.put("/:cid", cartController.updateCart);
router.put("/:cid/products/:pid", cartController.updateProductQuantityInCart);
router.delete("/:cid", cartController.deleteAllProductsCart);
router.post(
  "/:cid/purchase",
  passport.authenticate("current", { session: false }),
  ticketController.purchaseCart
);

export default router;
