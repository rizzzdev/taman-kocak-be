import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import { routers } from "../routes/index.js";
import { corsConfig } from "../../shared/configs/cors.config.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
// import { isOwnerMiddleware } from "../middlewares/is-owner.middleware.js";
import { staticFileMiddleware } from "../middlewares/static-file.middleware.js";
import { uploadMiddleware } from "../middlewares/image-uploader.middleware.js";

const server = () => {
  const app = express();
  app.use(express.json());
  app.use(urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors(corsConfig));
  app.use(helmet());
  // app.use(authMiddleware);
  // app.use(isOwnerMiddleware);
  routers(app);
  staticFileMiddleware(app);
  app.use(errorMiddleware);
  app.post("/upload", uploadMiddleware);

  return app;
};

export default server;
