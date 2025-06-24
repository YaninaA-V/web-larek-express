import {
  createProducts,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../controllers/productController";
import express from "express";
import {
  validateObjectId,
  validateProductBody,
  validateProductUpdateBody,
} from "../middlewares/validators";
import { auth } from "../middlewares/auth";

const productRoutes = express.Router();

productRoutes.get("/", getAllProducts);
productRoutes.post("/", validateProductBody, createProducts);
productRoutes.delete("/:productId", auth, validateObjectId, deleteProduct);
productRoutes.patch(
  "/:productId",
  auth,
  validateObjectId,
  validateProductUpdateBody,
  updateProduct
);

export default productRoutes;
