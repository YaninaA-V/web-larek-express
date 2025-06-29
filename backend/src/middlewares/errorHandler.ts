import { NextFunction, Request, Response } from 'express';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import InternalServerError from '../errors/internal-server-error';
import NotFoundError from '../errors/not-found-error';

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof BadRequestError) {
    res.status(err.statusCode).json({
      message: err.message || 'Переданы некорректные данные',
    });
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(err.statusCode).json({
      message: err.message || 'Ресурс не найден',
    });
    return;
  }

  if (err instanceof ConflictError) {
    res.status(err.statusCode).json({
      message: err.message || 'Конфликт данных',
    });
    return;
  }

  if (err instanceof InternalServerError) {
    res.status(err.statusCode).json({
      message: err.message || 'Внутренняя ошибка сервера',
    });
    return;
  }

  if (err.name === 'ValidationError') {
    res.status(400).json({
      message: 'Ошибка валидации данных',
    });
    return;
  }
  res.status(500).json({
    message: 'На сервере произошла ошибка',
  });
};

export default errorHandler;
