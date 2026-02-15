import { NotFoundError } from "../../../shared/errors/index.js";
import { postRepo, type IPostRepo } from "../../post/repo/post.repo.js";
import { userRepo, type IUserRepo } from "../../user/repo/user.repo.js";
import type { PatchCommentDTO, PostCommentDTO } from "../domain/comment.dto.js";
import type { GetCommentsQuery } from "../domain/comment.query.js";
import { commentRepo, type ICommentRepo } from "../repo/comment.repo.js";

export interface ICommentService extends ICommentRepo {}

export class CommentService implements ICommentService {
  constructor(
    private readonly commentRepo: ICommentRepo,
    private readonly userRepo: IUserRepo,
    private readonly postRepo: IPostRepo,
  ) {}

  getComments = async (query?: GetCommentsQuery) => {
    const comments = await this.commentRepo.getComments(query);
    if (comments.length === 0) {
      throw new NotFoundError("No comments data found!");
    }

    return comments;
  };

  getCommentById = async (id: string) => {
    const comment = await this.commentRepo.getCommentById(id);
    if (!comment) {
      throw new NotFoundError("No comment data found!");
    }

    return comment;
  };

  postComment = async (data: PostCommentDTO) => {
    const isUserExist = await this.userRepo.getUserById(data.userId);
    if (!isUserExist) {
      throw new NotFoundError("No user data found!");
    }

    const isPostExist = await this.postRepo.getPostById(data.postId);
    if (!isPostExist) {
      throw new NotFoundError("No post data found!");
    }

    const comment = await this.commentRepo.postComment(data);

    return comment;
  };

  patchCommentById = async (id: string, data: PatchCommentDTO) => {
    const isCommentExist = await this.commentRepo.getCommentById(id);
    if (!isCommentExist) {
      throw new NotFoundError("No comment data found!");
    }

    const comment = await this.commentRepo.patchCommentById(id, data);

    return comment;
  };

  deleteCommentById = async (id: string) => {
    const isCommentExist = await this.commentRepo.getCommentById(id);
    if (!isCommentExist) {
      throw new NotFoundError("No comment data found!");
    }

    const comment = await this.commentRepo.deleteCommentById(id);

    return comment;
  };
}

export const commentService = new CommentService(
  commentRepo,
  userRepo,
  postRepo,
);
