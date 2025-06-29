import { NextFunction } from 'express';
import NotFoundError from '../errors/not-found-error';

const notFoundHandler = (
  next: NextFunction,
) => {
  next(new NotFoundError());
};

export default notFoundHandler;
