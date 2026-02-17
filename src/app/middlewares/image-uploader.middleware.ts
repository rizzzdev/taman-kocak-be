import type { NextFunction, Request, Response } from "express";
import multer, { type FileFilterCallback } from "multer";
import { BadRequestError } from "../../shared/errors/index.js";
import { imageUploaderApi } from "../../shared/utils/image-uploader-api.util.js";
import fs from "fs";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import { localDateNow } from "../../shared/utils/date.util.js";
import { supabaseClient } from "../database/supabase/index.js";

// const storage = multer.diskStorage({
//   destination: (request, file, callback) => {
//     callback(null, "./public");
//   },
// });

const MB_IN_BYTES = 1024 * 1024;

// export const upload = multer({
//   storage,
// });

const uploadImage = () => {
  // const isPathExist = fs.existsSync(process.cwd() + path);
  // if (!isPathExist) {
  //   fs.mkdirSync(process.cwd() + path);
  // }

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
        const error = new BadRequestError(_error.message);

        return next(error);
      }

      request.body[fieldName] = `${path}${filename}`;

      return next();
    });
  };
};
