import z from "zod";

export const postBookmarkValidator = z.strictObject({
  postId: z.cuid(),
  userId: z.cuid(),
});

export const patchBookmarkValidator = postBookmarkValidator.partial();
