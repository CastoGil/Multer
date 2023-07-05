import express from "express";
import {
  realTimeAddProduct,
  realTimeDeleteProduct,
  realTimeProduct,
  viewProduct,
} from "../controllers/controllerDb/viewsManager.js";
import { authorize, admin } from "../middlewares/index.js";
const router = express.Router();



////////////////Ruta principal vista de los productos en tabla///////////////
router.get("/", viewProduct);
//////////////////////Ruta websocket//////////////////////
router.get("/realtimeproducts", realTimeProduct);
router.post("/realtimeproducts",admin, authorize, realTimeAddProduct);
router.delete("/realtimeproducts/:pid",admin, authorize, realTimeDeleteProduct);

export default router;
