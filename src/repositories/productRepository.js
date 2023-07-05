import { productDAO } from "../Dao/products/productDao.js";
import EErrors from "../services/errors/enums.js";
import CustomError from "../services/errors/CustomError.js";
const productRepository = {
  getAllProducts: async (query, sort, page, limit) => {
    try {
      return await productDAO.getAllProducts(query, sort, page, limit);
    } catch (error) {
      throw new CustomError({
        name: "Database Error",
        cause: "Failed to get all product",
        code: EErrors.DATABASE_ERROR,
        message:"Error in communication with repository database get all products"
      });
    }
  },
  getProductById: async (id) => {
    try {
      return await productDAO.getProductById(id);
    } catch (error) {
      throw new CustomError({
        name: "Database Error",
        cause: "Failed to get Product by Id",
        code: EErrors.DATABASE_ERROR,
        message:"Error in communication with repository database get product by id"
      });
    }
   
  },
  createProduct: async (product) => {
    try {
      return await productDAO.createProduct(product);
    } catch (error) {
      throw new CustomError({
        name: "Database Error",
        cause: error.message,
        code: EErrors.DATABASE_ERROR,
        message:"Error in communication with repository database create product"
      });
    }
   
  },
  updateProduct: async (id, product) => {
    try {
      return await productDAO.updateProduct(id, product, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw new CustomError({
        name: "Database Error",
        cause: "Failed to update Product",
        code: EErrors.DATABASE_ERROR,
        message:"Error in communication with repository database update product"
      });
    }
    
  },
  deleteProduct: async (id) => {
    try {
      return await productDAO.deleteProduct(id);
    } catch (error) {
      throw new CustomError({
        name: "Database Error",
        cause: "Failed to delete Product",
        code: EErrors.DATABASE_ERROR,
        message:"Error in communication with repository database delete product"
      });
    }
   
  },
};

export default productRepository;
