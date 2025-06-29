import { NextFunction, Request, Response } from 'express';
import { Error, Error as MongooseError } from 'mongoose';
import { ApiListResponse } from '../types/api';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import InternalServerError from '../errors/internal-server-error';
import NotFoundError from '../errors/not-found-error';
import Product, { IProduct } from '../models/product';

export const getAllProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const products: IProduct[] = await Product.find();
    const response: ApiListResponse<IProduct> = {
      total: products.length,
      items: products,
    };

    res.status(200).json(response);
  } catch (error) {
    next(new InternalServerError('Ошибка при получении товаров'));
  }
};

export const createProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      description, image, title, category, price,
    }: IProduct = req.body;

    const newProduct: IProduct = new Product({
      title,
      image: {
        fileName: image.fileName,
        originalName: image.originalName,
      },
      category,
      description: description || '',
      price: price ?? null,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error: any) {
    if (error instanceof MongooseError.ValidationError) {
      next(new BadRequestError('Ошибка валидации данных при создании товара'));
      return;
    }
    if (error instanceof Error && error.message.includes('E11000')) {
      next(new ConflictError());
      return;
    }
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const productDelete = await Product.findById(req.params.productId);

    if (!productDelete) {
      next(new NotFoundError('Товар не найден'));
      return;
    }

    await Product.findByIdAndDelete(req.params.productId);
    res.json({ message: 'Товар успешно удален' });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const productUpdate = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true },
    );

    if (!productUpdate) {
      next(new NotFoundError('Товар не найден'));
      return;
    }

    res.json(productUpdate);
  } catch (error) {
    next(error);
  }
};
