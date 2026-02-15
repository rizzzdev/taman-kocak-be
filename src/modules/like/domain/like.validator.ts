import z from "zod";

export const postLikeValidator = z.strictObject({
  postId: z.cuid(),
  userId: z.cuid(),
});

export const patchLikeValidator = postLikeValidator.partial();
