import z from "zod";

export const postSessionValidator = z.strictObject({
  username: z.string().min(8, "Username must be at least 8 characters long!"),
  password: z.string().min(8, "Password must be at least 8 characters long!"),
});
