import express from 'express';
import {
  createProducts,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from '../controllers/productController';
import {
  validateObjectId,
  validateProductBody,
  validateProductUpdateBody,
} from '../middlewares/validators';

const productRoutes = express.Router();

productRoutes.get('/', getAllProducts);
productRoutes.post('/', validateProductBody, createProducts);
productRoutes.delete('/:productId', validateObjectId, deleteProduct);
productRoutes.patch(
  '/:productId',
  validateObjectId,
  validateProductUpdateBody,
  updateProduct,
);

export default productRoutes;
