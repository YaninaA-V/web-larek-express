import { celebrate, Joi } from 'celebrate';
import mongoose from 'mongoose';

export const validateObjectId = celebrate({
  params: Joi.object({
    productId: Joi.string()
      .custom((value, helpers) => (mongoose.Types.ObjectId.isValid(value)
        ? value
        : helpers.error('any.invalid')))
      .required(),
  }),
});

export const validateProductBody = celebrate({
  body: Joi.object({
    title: Joi.string().min(2).max(30).required(),
    image: Joi.object({
      fileName: Joi.string().required(),
      originalName: Joi.string().required(),
    }).required(),
    category: Joi.string().required(),
    description: Joi.string().default(''),
    price: Joi.number().default(null),
  }),
});

export const validateProductUpdateBody = celebrate({
  body: Joi.object({
    title: Joi.string().min(2).max(30),
    image: Joi.object({
      fileName: Joi.string(),
      originalName: Joi.string(),
    }),
    category: Joi.string(),
    description: Joi.string(),
    price: Joi.number(),
  }).min(1),
});
