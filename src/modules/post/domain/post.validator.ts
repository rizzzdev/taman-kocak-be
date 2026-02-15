import z from "zod";

export const postPostValidator = z.strictObject({
  caption: z.string().min(1, "Caption must be at least 1 characters long!"),
  imageUrl: z.string().optional(),
  userId: z.string(),
});

export const patchPostValidator = postPostValidator.partial();
