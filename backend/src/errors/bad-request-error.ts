class BadRequestError extends Error {
  public statusCode: number;

  constructor(
    message: string = "Переданы некорректные данные в методы создания товара, заказа"
  ) {
    super(message);
    this.statusCode = 400;
  }
}

export default BadRequestError;
