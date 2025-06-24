import { createOrder, orderValidators } from "../controllers/orderController";
import express from "express";

const orderRoutes = express.Router();

orderRoutes.post("/", orderValidators, createOrder);

export default orderRoutes;
