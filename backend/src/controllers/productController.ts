import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { ApiListResponse } from '../types/api';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import InternalServerError from '../errors/internal-server-error';
import NotFoundError from '../errors/not-found-error';
import product, { IProduct } from '../models/product';

export const getAllProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('Запрос к /product получен');
  try {
    const products: IProduct[] = await product.find();
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
) => {
  try {
    const {
      description, image, title, category, price,
    }: IProduct = req.body;

    const newProduct: IProduct = new product({
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
      return next(
        new BadRequestError('Ошибка валидации данных при создании товара'),
      );
    }
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError());
    }
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productDelete = await product.findById(req.params.productId);

    if (!productDelete) {
      return next(new NotFoundError('Товар не найден'));
    }

    await product.findByIdAndDelete(req.params.productId);
    res.json({ message: 'Товар успешно удален' });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productUpdate = await product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true },
    );
    if (!productUpdate) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    res.json(productUpdate);
  } catch (error) {
    console.error('Ошибка при обновлении товара:', error);
    res.status(500).json({ message: 'Произошла ошибка при обновлении товара' });
  }
};
