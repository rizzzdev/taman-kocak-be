import { Router } from "express";
import { postController } from "./post.controller.js";
import { validatorMiddleware } from "../../../app/middlewares/validator.middleware.js";
import {
  patchPostValidator,
  postPostValidator,
} from "../domain/post.validator.js";
import { imageUploaderMiddleware } from "../../../app/middlewares/image-uploader.middleware.js";

const router = Router();
const { getPosts, getPostById, postPost, patchPostById, deletePostById } =
  postController;

router.get("/", getPosts);
router.get("/:id", getPostById);
router.post(
  "/",
  imageUploaderMiddleware("post-image"),
  validatorMiddleware(postPostValidator),
  postPost,
);
router.patch(
  "/:id",
  imageUploaderMiddleware("post-image"),
  validatorMiddleware(patchPostValidator),
  patchPostById,
);
router.delete("/:id", deletePostById);

export const postRouter = {
  endpoint: "/posts",
  router,
};
