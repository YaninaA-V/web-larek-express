import { NextFunction } from 'express';
import NotFoundError from '../errors/not-found-error';

export const notFoundHandler = (
  next: NextFunction,
) => {
  next(new NotFoundError());
};
