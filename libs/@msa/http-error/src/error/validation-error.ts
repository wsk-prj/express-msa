import { HttpError } from "./http-error";

export interface ValidationFieldError {
  field: string;
  message: string;
  value?: any;
}

export class ValidationError extends HttpError {
  constructor(fieldErrors: ValidationFieldError[]) {
    super();
    this.status = 400;
    this.message = "Request Field Validation Error";
    this.details = fieldErrors.reduce((acc, error) => {
      acc[error.field] = error.message;
      return acc;
    }, {} as Record<string, string>);
  }
}

