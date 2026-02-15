import type { CorsOptions } from "cors";
import { envConfig } from "./env.config.js";

export const corsConfig: CorsOptions = {
  credentials: true,
  origin: [envConfig.clientUrl!, "http://192.168.1.73:3000"],
  methods: ["GET", "POST", "DELETE", "PATCH", "OPTIONS"],
};
