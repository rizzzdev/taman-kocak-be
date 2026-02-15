import type { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { ValidationError } from "../../shared/errors/index.js";
import { imageRemover } from "../../shared/utils/image-remover.util.js";

export const validatorMiddleware = (schema: ZodType) => {
  return (request: Request, response: Response, next: NextFunction) => {
    const body = request.body;
    const { image, ...data } = body;
    const error = !!data && schema.safeParse(data)?.error;

    if (!!data && error) {
      const message = error.issues
        .map((issue) => `${issue.message} at path ${issue.path}`)
        .join("\n\n");

      const imageUrl = request.body?.pictureUrl || request.body?.imageUrl;
      imageUrl && imageRemover(imageUrl);

      throw new ValidationError(message);
    }

    next();
  };
};
