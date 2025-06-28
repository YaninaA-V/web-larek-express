import { NextFunction, Request, Response } from 'express';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import InternalServerError from '../errors/internal-server-error';
import NotFoundError from '../errors/not-found-error';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof BadRequestError) {
    return res.status(err.statusCode).json({
      message: err.message || 'Переданы некорректные данные',
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({
      message: err.message || 'Ресурс не найден',
    });
  }

  if (err instanceof ConflictError) {
    return res.status(err.statusCode).json({
      message: err.message || 'Конфликт данных',
    });
  }

  if (err instanceof InternalServerError) {
    return res.status(err.statusCode).json({
      message: err.message || 'Внутренняя ошибка сервера',
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Ошибка валидации данных',
    });
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'На сервере произошла ошибка',
  });
};
