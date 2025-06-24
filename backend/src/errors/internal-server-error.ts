class InternalServerError extends Error {
  public statusCode: number;

  constructor(message: string = "Ошибка сервера") {
    super(message);
    this.statusCode = 500;
  }
}

export default InternalServerError;
