import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { BadRequestError } from "../../shared/errors/index.js";
import { localDateNow } from "../../shared/utils/date.util.js";
import { supabaseClient } from "../database/supabase/index.js";

const MB_IN_BYTES = 1024 * 1024;

const uploadImage = () => {
  const storage = multer.memoryStorage();

  return multer({
    storage,
  });
};

type ImageType = "profile-picture" | "post-image";

export const imageUploaderMiddleware = (type: ImageType) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const upload = uploadImage();
    let path: string;
    let fieldName: string;

    if (type === "profile-picture") {
      path = `/profile-pictures/`;
      fieldName = "pictureUrl";
    } else {
      path = `/post-images/`;
      fieldName = "imageUrl";
    }

    upload.single("image")(request, response, async (error) => {
      if (error) {
        return next(error);
      }

      if (!request.file) {
        return next();
      }

      if (request.file && !request.file?.mimetype.startsWith("image/")) {
        const error = new BadRequestError("Only image files are allowed!");

        return next(error);
      }

      if (request.file && request.file.size > 5 * MB_IN_BYTES) {
        console.log({ fileSize: request.file.size });
        const error = new BadRequestError("Image size must be less than 5MB!");

        return next(error);
      }

      const imageBuffer = request.file.buffer;
      const format = request.file.mimetype.split("/").pop();
      const now = localDateNow().getTime();
      const filename = now + "." + format;

      const { error: _error } = await supabaseClient.storage
        .from("image")
        .upload(path + filename, imageBuffer);

      if (_error) {
        console.log({ error: _error });
        const error = new BadRequestError(_error.message);

        return next(error);
      }

      request.body[fieldName] = `${path}${filename}`;

      return next();
    });
  };
};
