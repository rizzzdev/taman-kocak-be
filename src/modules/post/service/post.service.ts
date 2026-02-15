import { NotFoundError } from "../../../shared/errors/index.js";
import { imageRemover } from "../../../shared/utils/image-remover.util.js";
import type { PatchPostDTO, PostPostDTO } from "../domain/post.dto.js";
import type {
  GetPostQuery,
  GetPostsQuery,
  PostPostQuery,
} from "../domain/post.query.js";
import { postRepo, type IPostRepo } from "../repo/post.repo.js";

export interface IPostService extends IPostRepo {}

export class PostService implements IPostService {
  constructor(private readonly postRepo: IPostRepo) {}

  getPosts = async (query?: GetPostsQuery) => {
    const posts = await this.postRepo.getPosts(query);
    if (posts.length === 0) {
      throw new NotFoundError("No posts data found!");
    }

    return posts;
  };

  getPostById = async (id: string, query?: GetPostQuery) => {
    const post = await this.postRepo.getPostById(id, query);
    if (!post) {
      throw new NotFoundError("No post data found!");
    }

    return post;
  };

  postPost = async (data: PostPostDTO, query?: PostPostQuery) => {
    const post = await this.postRepo.postPost(data, query);

    return post;
  };

  patchPostById = async (
    id: string,
    data: PatchPostDTO,
    query?: PostPostQuery,
  ) => {
    const isPostExist = await this.postRepo.getPostById(id, query);
    if (!isPostExist) {
      throw new NotFoundError("No post data found!");
    }

    if (data.imageUrl && isPostExist.imageUrl) {
      imageRemover(isPostExist.imageUrl);
    }

    const post = await this.postRepo.patchPostById(id, data, query);

    return post;
  };

  deletePostById = async (id: string, query?: PostPostQuery) => {
    const isPostExist = await this.postRepo.getPostById(id, query);
    if (!isPostExist) {
      throw new NotFoundError("No post data found!");
    }

    if (isPostExist.imageUrl) {
      imageRemover(isPostExist.imageUrl);
    }

    const post = await this.postRepo.deletePostById(id, query);

    return post;
  };
}

export const postService = new PostService(postRepo);
