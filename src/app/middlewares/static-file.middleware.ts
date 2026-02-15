import type { Application, NextFunction, Request, Response } from "express";
import express from "express";
import { NotFoundError } from "../../shared/errors/index.js";
import {
  StatusCode,
  type ApiResponse,
} from "../../shared/types/api-response.type.js";
import path from "node:path";

export const staticFileMiddleware = (app: Application) => {
  app.use("/public", express.static(path.join(process.cwd(), "public")));
  app.use("/public", (request: Request, response: Response) => {
    const apiResponse: ApiResponse<null> = {
      error: true,
      statusCode: StatusCode.NOT_FOUND,
      message: "Static file not found",
      data: null,
      pagination: null,
    };

    return response.status(apiResponse.statusCode).json(apiResponse);
  });
};
