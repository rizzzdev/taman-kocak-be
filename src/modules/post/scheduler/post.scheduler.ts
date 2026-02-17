import { schedule } from "node-cron";
import { postRepo } from "../repo/post.repo.js";
import type { PostEntity } from "../domain/post.entity.js";
import { localDateNow } from "../../../shared/utils/date.util.js";

const calculateTrendingPerPost = async (post: PostEntity) => {
  const HOURS_IN_MILLISECONDS = 1000 * 60 * 60;

  const commentsCount = new Array(
    ...new Set(
      post
        .comments!.filter((comment) => comment.user?.id !== post.user?.id)
        .map((comment) => comment.user?.id),
    ),
  ).length;
  const likesCount = post.likes!.filter(
    (like) => like.user?.id !== post.user?.id,
  ).length;
  const repostsCount = post.reposts!.filter(
    (repost) => repost.user?.id !== post.user?.id,
  ).length;
  const bookmarksCount = post.bookmarks!.filter(
    (bookmark) => bookmark.user?.id !== post.user?.id,
  ).length;

  const createdAt = post.createdAt.getTime();
  const now = localDateNow().getTime();

  const hoursSinceCreated = (now - createdAt) / HOURS_IN_MILLISECONDS;

  const weightScore =
    25 * commentsCount +
    10 * likesCount +
    40 * repostsCount +
    30 * bookmarksCount;

  const trendingScore = (weightScore * 1000) / (hoursSinceCreated + 2) ** 1.5;

  await postRepo.patchPostById(post.id, { trendingScore });
};

const calculateTrendingAll = async () => {
  const posts = await postRepo.getPosts({
    includeAll: true,
    includeBookmarks: true,
    includeComments: true,
    includeLikes: true,
    includeReposts: true,
    includeUser: true,
  });

  for (const post of posts) {
    await calculateTrendingPerPost(post);
  }

  console.log("Trending scheduler is running!");
};

export const calculateTrendingScheduler = () => {
  schedule("*/5 * * * *", calculateTrendingAll);
};
