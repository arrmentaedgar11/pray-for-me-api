export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export const NotFound = (msg = "Not found") => new HttpError(404, msg);
export const BadRequest = (msg = "Bad request") => new HttpError(400, msg);