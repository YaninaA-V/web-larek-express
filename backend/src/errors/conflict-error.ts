class ConflictError extends Error {
  public statusCode: number;

  constructor(message: string = "Товар с таким названием уже создан") {
    super(message);
    this.statusCode = 409;
  }
}

export default ConflictError;
