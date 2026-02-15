import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../../shared/errors/index.js";
import type { GetLikesQuery } from "../domain/like.query.js";
import { likeService, type ILikeService } from "../service/like.service.js";
import {
  StatusCode,
  type ApiResponse,
} from "../../../shared/types/api-response.type.js";
import type { LikeEntity } from "../domain/like.entity.js";
import type { PostLikeDTO } from "../domain/like.dto.js";

export class LikeController {
  constructor(private readonly LikeService: ILikeService) {}

  getLikes = async (
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

    const LikesQuery: GetLikesQuery = {
      ...(query.limit && { limit: Number(query.limit) }),
      ...(query.page && { page: Number(query.page) }),
      ...(query?.postId && { postId: query.postId }),
      ...(query?.userId && { userId: query.userId }),
    };

    try {
      const likes = await this.LikeService.getLikes(LikesQuery);
      const apiResponse: ApiResponse<LikeEntity[]> = {
        error: false,
        statusCode: StatusCode.OK,
        message: "Get likes data successfully!",
        data: likes,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      return next(error);
    }
  };

  getLikeById = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const id = request.params.id as string;

    try {
      const like = await this.LikeService.getLikeById(id);
      const apiResponse: ApiResponse<LikeEntity> = {
        error: false,
        statusCode: StatusCode.OK,
        message: "Get like data successfully!",
        data: like,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      return next(error);
    }
  };

  postLike = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const data = request.body as PostLikeDTO;

    try {
      const like = await this.LikeService.postLike(data);
      const apiResponse: ApiResponse<LikeEntity> = {
        error: false,
        statusCode: StatusCode.CREATED,
        message: "Post like successfully!",
        data: like,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      return next(error);
    }
  };

  deleteLikeById = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const id = request.params.id as string;

    try {
      const like = await this.LikeService.deleteLikeById(id);
      const apiResponse: ApiResponse<LikeEntity> = {
        error: false,
        statusCode: StatusCode.OK,
        message: "Delete like successfully!",
        data: like,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      return next(error);
    }
  };
}

export const likeController = new LikeController(likeService);
