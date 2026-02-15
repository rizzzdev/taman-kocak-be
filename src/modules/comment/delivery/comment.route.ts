import { Router } from "express";
import { commentController } from "./comment.controller.js";
import { validatorMiddleware } from "../../../app/middlewares/validator.middleware.js";
import {
  patchCommentValidator,
  postCommentValidator,
} from "../domain/comment.validator.js";

const router = Router();
const {
  getComments,
  getCommentById,
  postComment,
  patchCommentById,
  deleteCommentById,
} = commentController;

router.get("/", getComments);
router.get("/:id", getCommentById);
router.post("/", validatorMiddleware(postCommentValidator), postComment);
router.patch(
  "/:id",
  validatorMiddleware(patchCommentValidator),
  patchCommentById,
);
router.delete("/:id", deleteCommentById);

export const commentRouter = {
  endpoint: "/comments",
  router,
};
