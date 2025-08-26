import { HttpError } from "@/api/error/http-error";

export class InternalServerError extends HttpError {
  constructor(details?: any) {
    super();
    this.status = 500;
    this.message = "Internal Server Error";
    this.details = details;
  }
}
