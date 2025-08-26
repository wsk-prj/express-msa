import { HttpError } from "./http-error";

export class BadRequestError extends HttpError {
  constructor(details?: any) {
    super();
    this.status = 400;
    this.message = "Bad Request";
    this.details = details;
  }
}

export class UnauthorizedError extends BadRequestError {
  constructor(details?: any) {
    super();
    this.status = 401;
    this.message = "Unauthorized";
    this.details = details;
  }
}

export class ForbiddenError extends BadRequestError {
  constructor(details?: any) {
    super();
    this.status = 403;
    this.message = "Forbidden";
    this.details = details;
  }
}

export class NotFoundError extends BadRequestError {
  constructor(details?: any) {
    super();
    this.status = 404;
    this.message = "Not Found";
    this.details = details;
  }
}

export class ConflictError extends BadRequestError {
  constructor(details?: any) {
    super();
    this.status = 409;
    this.message = "Conflict";
    this.details = details;
  }
}
