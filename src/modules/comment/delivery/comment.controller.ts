import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../../shared/errors/index.js";
import type { GetCommentsQuery } from "../domain/comment.query.js";
import {
  commentService,
  type ICommentService,
} from "../service/comment.service.js";
import {
  StatusCode,
  type ApiResponse,
} from "../../../shared/types/api-response.type.js";
import type { CommentEntity } from "../domain/comment.entity.js";
import type { PatchCommentDTO, PostCommentDTO } from "../domain/comment.dto.js";

export class CommentController {
  constructor(private readonly commentService: ICommentService) {}

  getComments = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const query = request.query as Record<string, string>;

    const isLimitNan = query.limit && isNaN(Number(query.limit));
    const isPageNan = query.page && isNaN(Number(query.page));

    if (isLimitNan || isPageNan) {
      return next(new BadRequestError("Limit or page must be number!"));
    }

    const commentsQuery: GetCommentsQuery = {
      ...(query.limit && { limit: Number(query.limit) }),
      ...(query.page && { page: Number(query.page) }),
      ...(query?.postId && { postId: query.postId }),
      ...(query?.userId && { userId: query.userId }),
    };

    try {
      const comments = await this.commentService.getComments(commentsQuery);
      const apiResponse: ApiResponse<CommentEntity[]> = {
        error: false,
        statusCode: StatusCode.OK,
        message: "Get comments data successfully!",
        data: comments,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      return next(error);
    }
  };

  getCommentById = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const id = request.params.id as string;

    try {
      const comment = await this.commentService.getCommentById(id);
      const apiResponse: ApiResponse<CommentEntity> = {
        error: false,
        statusCode: StatusCode.OK,
        message: "Get comment data successfully!",
        data: comment,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      return next(error);
    }
  };

  postComment = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const data = request.body as PostCommentDTO;

    try {
      const comment = await this.commentService.postComment(data);
      const apiResponse: ApiResponse<CommentEntity> = {
        error: false,
        statusCode: StatusCode.CREATED,
        message: "Post comment successfully!",
        data: comment,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      return next(error);
    }
  };

  patchCommentById = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const id = request.params.id as string;
    const data = request.body as PatchCommentDTO;

    try {
      const comment = await this.commentService.patchCommentById(id, data);
      const apiResponse: ApiResponse<CommentEntity> = {
        error: false,
        statusCode: StatusCode.OK,
        message: "Patch comment successfully!",
        data: comment,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      return next(error);
    }
  };

  deleteCommentById = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const id = request.params.id as string;

    try {
      const comment = await this.commentService.deleteCommentById(id);
      const apiResponse: ApiResponse<CommentEntity> = {
        error: false,
        statusCode: StatusCode.OK,
        message: "Delete comment successfully!",
        data: comment,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      return next(error);
    }
  };
}

export const commentController = new CommentController(commentService);
