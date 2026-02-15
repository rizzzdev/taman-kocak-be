import { Router } from "express";
import { accessTokenController } from "./access-token.controller.js";

const router = Router();
const { postAccessToken } = accessTokenController;

router.post("/", postAccessToken);

export const accessTokenRouter = {
  endpoint: "/access-tokens",
  router,
};
