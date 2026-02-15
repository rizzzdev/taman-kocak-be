import { Router } from "express";
import { userController } from "./user.controller.js";
import { validatorMiddleware } from "../../../app/middlewares/validator.middleware.js";
import {
  patchUserValidator,
  postUserValidator,
} from "../domain/user.validator.js";
import { imageUploaderMiddleware } from "../../../app/middlewares/image-uploader.middleware.js";
// import { isOwnerMiddleware } from "../../../app/middlewares/is-owner.middleware.js";

const router = Router();
const { getUsers, getUserById, postUser, patchUserById, deleteUserById } =
  userController;

// router.get("/", isOwnerMiddleware, getUsers);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.post(
  "/",
  imageUploaderMiddleware("profile-picture"),
  validatorMiddleware(postUserValidator),
  postUser,
);
router.patch(
  "/:id",
  imageUploaderMiddleware("profile-picture"),
  validatorMiddleware(patchUserValidator),
  patchUserById,
);
router.delete("/:id", deleteUserById);

export const userRouter = {
  endpoint: "/users",
  router,
};
