import { NotFoundError } from "../../../shared/errors/index.js";
import { postRepo, type IPostRepo } from "../../post/repo/post.repo.js";
import { userRepo, type IUserRepo } from "../../user/repo/user.repo.js";
import type { PostLikeDTO } from "../domain/like.dto.js";
import type { GetLikesQuery } from "../domain/like.query.js";
import { likeRepo, type ILikeRepo } from "../repo/like.repo.js";

export interface ILikeService extends ILikeRepo {}

export class LikeService implements ILikeService {
  constructor(
    private readonly LikeRepo: ILikeRepo,
    private readonly userRepo: IUserRepo,
    private readonly postRepo: IPostRepo,
  ) {}

  getLikes = async (query?: GetLikesQuery) => {
    const likes = await this.LikeRepo.getLikes(query);
    if (likes.length === 0) {
      throw new NotFoundError("No likes data found!");
    }

    return likes;
  };

  getLikeById = async (id: string) => {
    const like = await this.LikeRepo.getLikeById(id);
    if (!like) {
      throw new NotFoundError("No like data found!");
    }

    return like;
  };

  postLike = async (data: PostLikeDTO) => {
    const isUserExist = await this.userRepo.getUserById(data.userId);
    if (!isUserExist) {
      throw new NotFoundError("No user data found!");
    }

    const isPostExist = await this.postRepo.getPostById(data.postId);
    if (!isPostExist) {
      throw new NotFoundError("No post data found!");
    }

    const isLikeExist = await this.LikeRepo.getLikes({
      userId: data.userId,
      postId: data.postId,
    });
    if (isLikeExist.length > 0) {
      const like = await this.LikeRepo.deleteLikeById(isLikeExist[0]!.id);

      return like;
    }

    const like = await this.LikeRepo.postLike(data);

    return like;
  };

  deleteLikeById = async (id: string) => {
    const isLikeExist = await this.LikeRepo.getLikeById(id);
    if (!isLikeExist) {
      throw new NotFoundError("No like data found!");
    }

    const like = await this.LikeRepo.deleteLikeById(id);

    return like;
  };
}

export const likeService = new LikeService(likeRepo, userRepo, postRepo);
