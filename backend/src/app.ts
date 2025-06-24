import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import productRoutes from "./routes/productRoutes";
import path from "path";
import orderRoutes from "./routes/orderRoutes";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { errorHandler } from "./middlewares/errorHandler";
import { errorLogger, requestLogger } from "./middlewares/logger";

const app = express();

app.use(cors());

app.use(express.json());

app.use(requestLogger);

app.use("/product", productRoutes);
app.use("/orders", orderRoutes);

app.use(errorLogger);
app.use(notFoundHandler);
app.use(errorHandler);

app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, () => {
  console.log("listening on port 3000");
});

async function connectToDatabase() {
  console.log("MongoDB подключена!");
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/weblarek");
  } catch (error) {
    console.error("Ошибка подключения к MongoDB:", error);
    process.exit(1);
  }
}
connectToDatabase();
