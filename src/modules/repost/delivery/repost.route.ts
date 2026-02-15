import { Router } from "express";
import { repostController } from "./repost.controller.js";
import { validatorMiddleware } from "../../../app/middlewares/validator.middleware.js";
import { postRepostValidator } from "../domain/repost.validator.js";

const router = Router();
const { getReposts, getRepostById, postRepost, deleteRepostById } =
  repostController;

router.get("/", getReposts);
router.get("/:id", getRepostById);
router.post("/", validatorMiddleware(postRepostValidator), postRepost);
router.delete("/:id", deleteRepostById);

export const repostRouter = {
  endpoint: "/reposts",
  router,
};
