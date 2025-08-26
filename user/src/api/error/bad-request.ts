import { HttpError } from "@/api/error/http-error";

export class BadRequestError extends HttpError {
  constructor(details?: any) {
    super();
    this.status = 400;
    this.message = "Bad Request";
    this.details = details;
  }
}

export class UnauthorizedError extends HttpError {
  constructor(details?: any) {
    super();
    this.status = 401;
    this.message = "Unauthorized";
    this.details = details;
  }
}

export class NotFoundError extends HttpError {
  constructor(details?: any) {
    super();
    this.status = 404;
    this.message = "Not Found";
    this.details = details;
  }
}
