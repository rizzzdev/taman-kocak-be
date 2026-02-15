import { StatusCode } from "../types/api-response.type.js";

export class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = StatusCode.BAD_REQUEST;
  }
}

export class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = StatusCode.NOT_FOUND;
  }
}

export class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = StatusCode.UNAUTHORIZED;
  }
}

export class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = StatusCode.FORBIDDEN;
  }
}

export class ValidationError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = StatusCode.BAD_REQUEST;
  }
}

export class InternalServerError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "InternalServerError";
    this.statusCode = StatusCode.INTERNAL_SERVER_ERROR;
  }
}
