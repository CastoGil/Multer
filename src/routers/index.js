import express from "express"
import productsRouter from "./productsRouter.js"
import cartRouter from "./cartRouter.js"
const router = express.Router()

///////////DEFINIMOS RUTAS DE PRODUCTOS Y CARRITO/////////////
router.use("/products", productsRouter)
router.use("/carts", cartRouter)

export default router