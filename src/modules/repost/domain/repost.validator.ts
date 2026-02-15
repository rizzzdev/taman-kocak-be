import z from "zod";

export const postRepostValidator = z.strictObject({
  postId: z.cuid(),
  userId: z.cuid(),
});

export const patchRepostValidator = postRepostValidator.partial();
