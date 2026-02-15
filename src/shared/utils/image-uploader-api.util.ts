import axios, { AxiosError } from "axios";
import { envConfig } from "../configs/env.config.js";
import { BadRequestError } from "../errors/index.js";
import type { Multer } from "multer";

export const imageUploaderApi = async (buffer: Buffer) => {
  const base64Image = buffer.toString("base64");

  try {
    const response = await axios.post(
      `https://api.imgbb.com/1/upload`,
      {
        image: base64Image,
      },
      {
        params: {
          key: envConfig.imgHostingApiKey,
        },
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      },
    );

    const imageUrl = response.data.data.url as string;

    return imageUrl;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.cause);
    }
    throw new BadRequestError("Image upload failed!");
  }
};
