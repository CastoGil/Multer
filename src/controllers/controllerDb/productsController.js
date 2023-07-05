import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { productService } from "../../services/productsService.js";
import { ProductDTO } from "../../Dto/productDto.js";
import CustomError from "../../services/errors/CustomError.js";
import {
  generateProductPropertiesError,
  generateProductIdError,
} from "../../services/errors/info.js";
import EErrors from "../../services/errors/enums.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const getAllProductsController = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "";
    const query = req.query.query || "";
    const token = req.cookies.token || "";
    const admin = req.cookies.role || "";
  
    const response = await productService.getAllProducts(
      query,
      sort,
      page,
      limit
    );
    if (token) {
      const user = jwt.verify(token, JWT_SECRET);
      const data = {
        response,
        first_name: user ? user.first_name : null,
        role: user ? user.role : null,
        token,
      };
      res.render("products", data);
    } else {
      const data = { response, admin };
      res.render("products", data);
    }
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
};


const getProductByIdController = async (req, res, next) => {
  try {
    const { pid } = req.params;
    if (!pid || typeof pid !== "string") {
      throw new CustomError({
        name: "Invalid Id Error",
        cause: generateProductIdError({ pid }),
        message: "Error trying to get Product by Id",
        code: EErrors.INVALID_IDS_ERROR,
      });
    }
    const product = await productService.getProductById(pid);
    const productDTO = new ProductDTO(
      product._id,
      product.title,
      product.description,
      product.price,
      product.thumbnail,
      product.code,
      product.stock,
      product.category
    );
    return res.render("detailProduct", productDTO);
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
};


const createProductController = async (req, res, next) => {
  try {
    const product = req.body;
    const requiredFields = [
      "title",
      "description",
      "price",
      "thumbnail",
      "code",
      "stock",
      "category",
    ];
    const isValidProduct = requiredFields.every((field) => product[field]);
    if (!isValidProduct) {
      const errorMessage = generateProductPropertiesError(product);
      throw new CustomError({
        name: "Product creation error",
        cause: errorMessage,
        message: "Error trying to create Product",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }

    const owner = req.user.role === "premium" ? req.user.email : "admin";
    const createdProduct = await productService.createProduct({
      ...product,
      owner,
    });
  
    const productDTO = {
      _id: createdProduct._id,
      title: createdProduct.title,
      description: createdProduct.description,
      price: createdProduct.price,
      thumbnail: createdProduct.thumbnail,
      code: createdProduct.code,
      stock: createdProduct.stock,
      category: createdProduct.category,
      owner: createdProduct.owner,
    };

    res.status(201).json(productDTO);
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
};


const updateProductController = async (req, res, next) => {
  try {
    const { pid } = req.params;
    if (!pid || typeof pid !== "string") {
      throw new CustomError({
        name: "Invalid Id Error",
        cause: generateProductIdError({ pid }),
        message: "Error trying to update Product",
        code: EErrors.INVALID_IDS_ERROR,
      });
    }
    console.log(req.body)
    const product = await productService.updateProduct(pid, req.body);
    console.log(product)
    const productDTO = new ProductDTO(
      product._id,
      product.title,
      product.description,
      product.price,
      product.thumbnail,
      product.code,
      product.stock,
      product.category
    );
    res.status(201).json(productDTO);
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(
        new CustomError({
          name: "Database Error",
          message: "An error occurred while communicating with the database.",
          cause: error.message,
          code: EErrors.DATABASE_ERROR,
        })
      );
    }
  }
};


const deleteProductController = async (req, res, next) => {
  try {
    const { pid } = req.params;
    if (!pid || typeof pid !== "string") {
      throw new CustomError({
        name: "Invalid Id Error",
        cause: generateProductIdError({ pid }),
        message: "Error trying to delete Product",
        code: EErrors.INVALID_IDS_ERROR,
      });
    }
    const product = await productService.getProductById(pid);
    
    if (
      req.user.role === "admin" ||
      (req.user.role === "premium" && product.owner === req.user.email)
    ) {
      await productService.deleteProduct(pid);
      res.status(200).json({ message: "Product deleted successfully" });
    } else {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this product" });
    }
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
};

export {
  getProductByIdController,
  createProductController,
  updateProductController,
  deleteProductController,
};
