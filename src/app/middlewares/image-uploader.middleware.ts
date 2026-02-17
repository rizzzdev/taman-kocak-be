import type { NextFunction, Request, Response } from "express";
import multer, { type FileFilterCallback } from "multer";
import { BadRequestError } from "../../shared/errors/index.js";
import { imageUploaderApi } from "../../shared/utils/image-uploader-api.util.js";
import fs from "fs";
import axios from "axios";

// const storage = multer.diskStorage({
//   destination: (request, file, callback) => {
//     callback(null, "./public");
//   },
// });

const MB_IN_BYTES = 1024 * 1024;

// export const upload = multer({
//   storage,
// });

const uploadImage = (path: string) => {
  const isPathExist = fs.existsSync(process.cwd() + path);
  if (!isPathExist) {
    fs.mkdirSync(process.cwd() + path);
  }

  const storage = multer.diskStorage({
    destination: (request, file, callback) => {
      callback(null, process.cwd() + path);
    },
    filename: (request, file, callback) => {
      const format = file.originalname.split(".").pop();
      callback(null, `${Date.now()}.${format}`);
    },
  });

  return multer({
    storage,
  });
};

type ImageType = "profile-picture" | "post-image";

export const imageUploaderMiddleware = (type: ImageType) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    let upload: multer.Multer;
    let path: string;
    let fieldName: string;

    if (type === "profile-picture") {
      path = `/public/profile-pictures`;
      fieldName = "pictureUrl";
      upload = uploadImage(path);
    } else {
      path = `/public/post-images`;
      fieldName = "imageUrl";
      upload = uploadImage(path);
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

      request.body[fieldName] = `${path}/${request.file.filename}`;

      return next();
    });
  };
};

const upload = () => {
  const storage = multer.memoryStorage();

  return multer({
    storage,
  });
};

export const uploadMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  upload().single("image")(request, response, async () => {
    if (request.file) {
      const image = request.file.buffer.toString();

      try {
        const _response = await axios.post(
          "https://api.imgbb.com/1/upload?key=8fe14a6567fd63dc0ad5ad99f4523c3a",
          {
            image,
          },
        );

        return response.send({ success: true, image: image });
      } catch (error) {
        return response.send({ success: false, image });
      }
    }

    return response.send({ file: null });
  });
};
