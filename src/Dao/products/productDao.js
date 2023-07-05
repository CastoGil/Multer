import { productModel } from "../models/products.js";
import EErrors from "../../services/errors/enums.js";
import CustomError from "../../services/errors/CustomError.js";

export const productDAO = {
  getAllProducts: async (query, sort, page, limit) => {
    try {
      const queryObject = {};
      if (query === "available") {
        queryObject.stock = { $gt: 0 };
      } else if (query === "unavailable") {
        queryObject.stock = { $lte: 0 };
      } else if (query) {
        queryObject.category = query;
      }
      const sortOrder = sort === "desc" ? -1 : 1;
      const sortObject = {};
      if (sort) {
        sortObject.price = sortOrder;
      }
      const options = {
        page,
        limit,
        sort: sortObject,
        lean: true,
      };
      const products = await productModel.paginate(queryObject, options);
      const response = {
        status: "success",
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.hasPrevPage ? page - 1 : null,
        nextPage: products.hasNextPage ? page + 1 : null,
        page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage
          ? `/api/products?page=${
              page - 1
            }&limit=${limit}&sort=${sort}&query=${query}`
          : null,
        nextLink: products.hasNextPage
          ? `/api/products?page=${
              page + 1
            }&limit=${limit}&sort=${sort}&query=${query}`
          : null,
        sortValue: sort,
      };
      return response;
    } catch (error) {
      throw error;
    }
  },
  getProductById: async (pid) => {
    try {
      const product = await productModel.findById(pid);
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    } catch (error) {
      throw error;
    }
  },
  createProduct: async (productDto) => {
    try {
      const { title, description, price, thumbnail, code, stock, category ,owner} = productDto;
      let products = await productModel.find();
      if (products.some((e) => e.code === productDto.code)) {
        throw new Error("code already entered");
      } else {
        const product = new productModel({
          title,
          price,
          description,
          stock,
          code,
          category,
          thumbnail,
          owner
        });
        await product.save();
        return product;
      }
    } catch (error) {
      throw new CustomError({
        name: "Database Error",
        cause: "Failed to create Product",
        code: EErrors.DATABASE_ERROR,
        message: `Error in communication with ProductDao database create product: ${error.message}`,
      });
    }
  },
  updateProduct: async (pid, productDto) => {
    try {
      const { title, price, description, stock, code, category, thumbnail } =
        productDto;
      const product = await productModel.findByIdAndUpdate(
        pid,
        { title, price, description, stock, code, category, thumbnail },
        { new: true }
      );
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    } catch (error) {
      throw error;
    }
  },
  deleteProduct: async (pid) => {
    try {
      const product = await productModel.findByIdAndDelete(pid);
      if (!product) {
        throw new Error("Product not found");
      }
    } catch (error) {
      throw error;
    }
  },
};
