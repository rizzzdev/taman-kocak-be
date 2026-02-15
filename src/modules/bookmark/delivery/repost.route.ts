import { Router } from "express";
import { validatorMiddleware } from "../../../app/middlewares/validator.middleware.js";
import { postBookmarkValidator } from "../domain/bookmark.validator.js";
import { bookmarkController } from "./repost.controller.js";

const router = Router();
const { getBookmarks, getBookmarkById, postBookmark, deleteBookmarkById } =
  bookmarkController;

router.get("/", getBookmarks);
router.get("/:id", getBookmarkById);
router.post("/", validatorMiddleware(postBookmarkValidator), postBookmark);
router.delete("/:id", deleteBookmarkById);

export const bookmarkRouter = {
  endpoint: "/bookmarks",
  router,
};
