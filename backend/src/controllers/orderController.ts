import { NextFunction, Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import { body, validationResult } from 'express-validator';
import product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import InternalServerError from '../errors/internal-server-error';

export const orderValidators = [
  body('payment')
    .isIn(['card', 'online'])
    .withMessage('Недопустимый метод оплаты'),
  body('email').isEmail().withMessage('Некорректный email'),
  body('phone').notEmpty().withMessage('Телефон обязателен'),
  body('address').notEmpty().withMessage('Адрес обязателен'),
  body('total').isNumeric().withMessage('Сумма должна быть числом'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('Должен быть хотя бы один товар'),
];

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(
      new BadRequestError('Ошибка валидации данных при оформлении заказа'),
    );
    return;
  }

  const {
    _payment, _email, _phone, _address, total, items,
  } = req.body;

  try {
    const products = await product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      next(new BadRequestError('Некоторые товары не найдены'));
      return;
    }

    const unavailableProducts = products.filter((p) => p.price === null);
    if (unavailableProducts.length > 0) {
      next(
        new BadRequestError('Некоторые товары недоступны для заказа'),
      );
      return;
    }

    const calculatedTotal = products.reduce(
      (sum, currentProduct) => sum + (currentProduct.price || 0),
      0,
    );
    if (calculatedTotal !== total) {
      next(new BadRequestError('Неверная сумма заказа'));
      return;
    }

    res.status(200).json({
      id: faker.string.uuid(),
      total,
    });
  } catch (error) {
    next(new InternalServerError());
  }
};
