import { productModel } from "../../Dao/models/products.js";
import { socketEmit, socketEmitBack } from "../../services/socket.js";
//vista principal con los productos
const viewProduct = async (req, res) => {
  try {
    await productModel
      .find({})
      .lean()
      .then((products) => {
        res.render("home", { products });
      });
  } catch {
    return res.status(404).send("La ruta no se encontro");
  }
};
//vista con los productos en tiempo real
const realTimeProduct = async (req, res) => {
  try {
    const products = await productModel.find();
    res.render("realTimeProducts", { products });
  } catch {
    return res.status(404).send("La ruta no se encontro");
  }
};
//agregamos productos a traves del formulario
const realTimeAddProduct = async (req, res) => {
  const objeto = req.body;
  let products = await productModel.find();
  if (products.some((e) => e.code == objeto.code)) {
    throw new Error("code already entered ");
  }
  try {
    const result = await productModel.create(objeto);
    socketEmit("producto", result);
    res.json({ msg: result });
  } catch {
    return res.status(404).send("La ruta no se encontro");
  }
};
//borramos producto a traves del boton eliminar
const realTimeDeleteProduct = async (req, res) => {
  const pid = req.params.pid;
  try {
    await productModel.deleteOne({ _id: pid });
    await socketEmitBack();
    return res.status(200).json({ msg: "product deleted" });
  } catch {
    return res.status(400).json({
      error: "product not deleted",
    });
  }
};
export {
  viewProduct,
  realTimeProduct,
  realTimeAddProduct,
  realTimeDeleteProduct,
}