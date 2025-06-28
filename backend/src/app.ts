import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { errorHandler } from './middlewares/errorHandler';
import { errorLogger, requestLogger } from './middlewares/logger';
import { errors } from 'celebrate';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(requestLogger);

app.use('/product', productRoutes);
app.use('/orders', orderRoutes);

app.use(errors());
app.use(notFoundHandler);
app.use(errorLogger);
app.use(errorHandler);

app.listen(3000, () => {
  console.log('listening on port 3000');
});

async function connectToDatabase() {
  const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/weblarek' } = process.env;

  try {
    await mongoose.connect(MONGO_URL);
    console.log('MongoDB подключена');
  } catch (error) {
    console.error('Ошибка подключения к MongoDB:', error);
    process.exit(1);
  }
}
connectToDatabase();
