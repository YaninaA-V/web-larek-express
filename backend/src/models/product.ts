import mongoose, { Schema, Document } from 'mongoose';

interface IProductImage {
  fileName: string;
  originalName: string;
}

export interface IProduct extends Document {
  title: string;
  image: IProductImage;
  category: string;
  description?: string;
  price?: number | null;
}

const productSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Название товара обязательно'],
    unique: true,
    minlength: [2, 'Название должно содержать минимум 2 символа'],
    maxlength: [30, 'Название не может превышать 30 символов'],
  },
  image: {
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
  },
  category: {
    type: String,
    required: [true, 'Категория товара обязательна'],
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    default: null,
  },
});

productSchema.post(
  'save',
  (error: any, doc: IProduct, next: Function) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      const duplicateError = new Error('Товар с таким названием уже существует');
      (duplicateError as any).status = 409;
      next(duplicateError);
    } else {
      next(error);
    }
  },
);

export default mongoose.model<IProduct>('product', productSchema, 'products');
