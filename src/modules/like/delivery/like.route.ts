import { Router } from "express";
import { likeController } from "./like.controller.js";
import { validatorMiddleware } from "../../../app/middlewares/validator.middleware.js";
import {
  patchLikeValidator,
  postLikeValidator,
} from "../domain/like.validator.js";

const router = Router();
const { getLikes, getLikeById, postLike, deleteLikeById } = likeController;

router.get("/", getLikes);
router.get("/:id", getLikeById);
router.post("/", validatorMiddleware(postLikeValidator), postLike);
router.patch("/:id", validatorMiddleware(patchLikeValidator));
router.delete("/:id", deleteLikeById);

export const likeRouter = {
  endpoint: "/likes",
  router,
};
