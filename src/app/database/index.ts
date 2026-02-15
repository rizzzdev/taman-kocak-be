import { PrismaPg } from "@prisma/adapter-pg";
import { envConfig } from "../../shared/configs/env.config.js";
import { PrismaClient } from "./prisma/client.js";

const adapter = new PrismaPg({
  connectionString: envConfig.dbUrl!,
});

export const prisma = new PrismaClient({
  adapter,
});
