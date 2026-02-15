// import type { NextFunction, Request, Response } from "express";
// import { userRepo } from "../../modules/user/repo/user.repo.js";
// import { ForbiddenError } from "../../shared/errors/index.js";
// import { sessionRepo } from "../../modules/session/repo/session.repo.js";
// import { postRepo } from "../../modules/post/repo/post.repo.js";
// import { commentRepo } from "../../modules/comment/repo/comment.repo.js";
// import { repostRepo } from "../../modules/repost/repo/repost.repo.js";
// import { bookmarkRepo } from "../../modules/bookmark/repo/bookmark.repo.js";

// export const isOwnerMiddleware = async (
//   request: Request,
//   response: Response,
//   next: NextFunction,
// ) => {
//   const path = request.headers["url"] as string;
//   const id = path.split("/").pop()?.split("?")[0];
//   const method = request.headers["method"] as string;

//   if (method !== "PATCH" && method !== "DELETE") {
//     return next();
//   }

//   const role = request.headers["user-role"] as string;
//   if (role === "SUPER_USER") {
//     return next();
//   }

//   const userId = request.headers["user-id"] as string;

//   const isUserPath = path.includes(`/users/${id}`);
//   const user = isUserPath && id ? await userRepo.getUserById(id) : null;
//   if (user?.id === userId) {
//     return next();
//   }

//   const isSessionPath = path.includes(`/sessions/${id}`);
//   const session =
//     isSessionPath && id
//       ? await sessionRepo.getSessionById(id, { includeUser: true })
//       : null;
//   if (session?.user?.id === userId) {
//     return next();
//   }

//   const isPostPath = path.includes(`/posts/${id}`);
//   const post =
//     isPostPath && id
//       ? await postRepo.getPostById(id, { includeUser: true })
//       : null;
//   if (post?.user?.id === userId) {
//     return next();
//   }

//   const isCommentPath = path.includes(`/comments/${id}`);
//   const comment =
//     isCommentPath && id
//       ? await commentRepo.getCommentById(id, { includeUser: true })
//       : null;
//   if (comment?.user?.id === userId) {
//     return next();
//   }

//   const isRepostPath = path.includes(`/reposts/${id}`);
//   const repost =
//     isRepostPath && id
//       ? await repostRepo.getRepostById(id, { includeUser: true })
//       : null;
//   if (repost?.user?.id === userId) {
//     return next();
//   }

//   const isBookmarkPath = path.includes(`/bookmarks/${id}`);
//   const bookmark =
//     isBookmarkPath && id
//       ? await bookmarkRepo.getBookmarkById(id, { includeUser: true })
//       : null;
//   if (bookmark?.user?.id === userId) {
//     return next();
//   }

//   throw new ForbiddenError("You are not have permission!");
// };
