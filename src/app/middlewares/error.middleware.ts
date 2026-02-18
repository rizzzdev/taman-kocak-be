import type { NextFunction, Request, Response } from "express";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../../shared/errors/index.js";
import {
  StatusCode,
  type ApiResponse,
} from "../../shared/types/api-response.type.js";
import { imageRemover } from "../../shared/utils/image-remover.util.js";

export const errorMiddleware = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const imageUrl = request.body?.pictureUrl || request.body?.imageUrl;
  imageUrl && imageRemover(imageUrl);

  console.log({ error });

  if (error instanceof BadRequestError) {
    const apiResponse: ApiResponse<null> = {
      error: true,
      statusCode: StatusCode.BAD_REQUEST,
      message: error.message,
      data: null,
      pagination: null,
    };

    response.status(apiResponse.statusCode).json(apiResponse);
    return;
  }

  if (error instanceof NotFoundError) {
    const apiResponse: ApiResponse<null> = {
      error: true,
      statusCode: StatusCode.NOT_FOUND,
      message: error.message,
      data: null,
      pagination: null,
    };

    response.status(apiResponse.statusCode).json(apiResponse);
    return;
  }

  if (error instanceof UnauthorizedError) {
    const apiResponse: ApiResponse<null> = {
      error: true,
      statusCode: StatusCode.UNAUTHORIZED,
      message: error.message,
      data: null,
      pagination: null,
    };

    response.status(apiResponse.statusCode).json(apiResponse);
    return;
  }

  if (error instanceof ForbiddenError) {
    const apiResponse: ApiResponse<null> = {
      error: true,
      statusCode: StatusCode.FORBIDDEN,
      message: error.message,
      data: null,
      pagination: null,
    };

    response.status(apiResponse.statusCode).json(apiResponse);
    return;
  }

  if (error instanceof ValidationError) {
    const apiResponse: ApiResponse<null> = {
      error: true,
      statusCode: StatusCode.BAD_REQUEST,
      message: error.message,
      data: null,
      pagination: null,
    };

    response.status(apiResponse.statusCode).json(apiResponse);
    return;
  }

  const apiResponse: ApiResponse<null> = {
    error: true,
    statusCode: StatusCode.INTERNAL_SERVER_ERROR,
    message: error.message,
    data: null,
    pagination: null,
  };

  console.log(error);

  response.status(apiResponse.statusCode).json(apiResponse);
  return;
};
