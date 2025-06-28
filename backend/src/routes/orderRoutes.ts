import express from 'express';
import { createOrder, orderValidators } from '../controllers/orderController';

const orderRoutes = express.Router();

orderRoutes.post('/', orderValidators, createOrder);

export default orderRoutes;
