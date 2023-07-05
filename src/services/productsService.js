import productRepository from "../repositories/productRepository.js";

export const productService = {
  getAllProducts: async (query, sort, page, limit) => {
    return await productRepository.getAllProducts(query, sort, page, limit);
  },
  getProductById: async (id) => {
    return await productRepository.getProductById(id);
  },
  createProduct: async (body) => {
    return await productRepository.createProduct(body);
  },
  updateProduct: async (pid, body) => {
    return await productRepository.updateProduct(pid, body);
  },
  deleteProduct: async (pid) => {
    return await productRepository.deleteProduct(pid);
  },
};

export default productService;
