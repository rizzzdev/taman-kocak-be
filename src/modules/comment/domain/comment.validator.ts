import z from "zod";

export const postCommentValidator = z.strictObject({
  text: z.string().min(1, "Text must be at least 1 characters long!"),
  postId: z.cuid(),
  userId: z.cuid(),
});

export const patchCommentValidator = postCommentValidator.partial();
