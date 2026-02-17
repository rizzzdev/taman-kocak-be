import { NotFoundError } from "../../../shared/errors/index.js";
import { postRepo, type IPostRepo } from "../../post/repo/post.repo.js";
import { userRepo, type IUserRepo } from "../../user/repo/user.repo.js";
import type { PostRepostDTO } from "../domain/repost.dto.js";
import type { GetRepostsQuery } from "../domain/repost.query.js";
import { repostRepo, type IRepostRepo } from "../repo/repost.repo.js";

export interface IRepostService extends IRepostRepo {}

export class RepostService implements IRepostService {
  constructor(
    private readonly repostRepo: IRepostRepo,
    private readonly userRepo: IUserRepo,
    private readonly postRepo: IPostRepo,
  ) {}

  getReposts = async (query?: GetRepostsQuery) => {
    const reposts = await this.repostRepo.getReposts(query);
    if (reposts.length === 0) {
      throw new NotFoundError("No reposts data found!");
    }

    return reposts;
  };

  getRepostById = async (id: string) => {
    const repost = await this.repostRepo.getRepostById(id);
    if (!repost) {
      throw new NotFoundError("No repost data found!");
    }

    return repost;
  };

  postRepost = async (data: PostRepostDTO) => {
    const isUserExist = await this.userRepo.getUserById(data.userId);
    if (!isUserExist) {
      throw new NotFoundError("No user data found!");
    }

    const isPostExist = await this.postRepo.getPostById(data.postId);
    if (!isPostExist) {
      throw new NotFoundError("No post data found!");
    }

    const isRepostExist = await this.repostRepo.getReposts({
      userId: data.userId,
      postId: data.postId,
    });
    if (isRepostExist.length > 0) {
      const repost = await this.repostRepo.deleteRepostById(
        isRepostExist[0]!.id,
      );

      return repost;
    }

    const repost = await this.repostRepo.postRepost(data);

    return repost;
  };

  deleteRepostById = async (id: string) => {
    const isRepostExist = await this.repostRepo.getRepostById(id);
    if (!isRepostExist) {
      throw new NotFoundError("No repost data found!");
    }

    const repost = await this.repostRepo.deleteRepostById(id);

    return repost;
  };
}

export const repostService = new RepostService(repostRepo, userRepo, postRepo);
