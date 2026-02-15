import z from "zod";

export const postUserValidator = z.strictObject({
  fullname: z.string().min(3, "Fullname must be at least 3 characters long!"),
  pictureUrl: z.string().optional(),
  username: z.string().min(8, "Username must be at least 8 characters long!"),
  password: z.string().min(8, "Password must be at least 8 characters long!"),
});

export const patchUserValidator = postUserValidator.partial().extend({
  oldPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long!")
    .optional(),
});
