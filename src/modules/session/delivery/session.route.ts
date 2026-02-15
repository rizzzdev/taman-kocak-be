import { Router } from "express";
import { sessionController } from "./session.controller.js";
import { validatorMiddleware } from "../../../app/middlewares/validator.middleware.js";
import { postSessionValidator } from "../domain/session.validator.js";

const router = Router();
const { getSessions, getSessionById, postSession, deleteSessionById } =
  sessionController;

router.get("/", getSessions);
router.get("/:id", getSessionById);
router.post("/", validatorMiddleware(postSessionValidator), postSession);
router.delete("/:id", deleteSessionById);

export const sessionRouter = {
  endpoint: "/sessions",
  router,
};
