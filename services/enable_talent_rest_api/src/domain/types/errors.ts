export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'HttpError';
  }

  static badRequest(message: string, details?: unknown): HttpError {
    return new HttpError(400, message, details);
  }

  static unauthorized(message = 'Unauthorized'): HttpError {
    return new HttpError(401, message);
  }

  static forbidden(message = 'Forbidden'): HttpError {
    return new HttpError(403, message);
  }

  static notFound(message = 'Not found'): HttpError {
    return new HttpError(404, message);
  }

  static conflict(message: string): HttpError {
    return new HttpError(409, message);
  }

  static internal(message = 'Internal server error'): HttpError {
    return new HttpError(500, message);
  }
}
