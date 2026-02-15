import type { Application, Router } from "express";
import { userRouter } from "../../modules/user/delivery/user.route.js";
import { sessionRouter } from "../../modules/session/delivery/session.route.js";
import { accessTokenRouter } from "../../modules/access-token/delivery/access-token.route.js";
import { postRouter } from "../../modules/post/delivery/post.route.js";
import { commentRouter } from "../../modules/comment/delivery/comment.route.js";
import { repostRouter } from "../../modules/repost/delivery/repost.route.js";
import { bookmarkRouter } from "../../modules/bookmark/delivery/repost.route.js";
import { likeRouter } from "../../modules/like/delivery/like.route.js";

interface IRouter {
  endpoint: string;
  router: Router;
}

const _routers: IRouter[] = [
  userRouter,
  postRouter,
  commentRouter,
  likeRouter,
  repostRouter,
  bookmarkRouter,
  sessionRouter,
  accessTokenRouter,
];

export const routers = (app: Application) => {
  _routers.forEach((_route) => {
    const { endpoint, router } = _route;
    app.use(endpoint, router);
  });

  return app;
};
