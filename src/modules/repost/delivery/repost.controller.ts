import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../../shared/errors/index.js";
import type { GetRepostsQuery } from "../domain/repost.query.js";
import {
  repostService,
  type IRepostService,
} from "../service/repost.service.js";
import {
  StatusCode,
  type ApiResponse,
} from "../../../shared/types/api-response.type.js";
import type { RepostEntity } from "../domain/repost.entity.js";
import type { PatchRepostDTO, PostRepostDTO } from "../domain/repost.dto.js";

export class RepostController {
  constructor(private readonly repostService: IRepostService) {}

  getReposts = async (
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

    const RepostsQuery: GetRepostsQuery = {
      ...(query.limit && { limit: Number(query.limit) }),
      ...(query.page && { page: Number(query.page) }),
      ...(query?.includeUser && {
        includeUser: Boolean(query.includeUser),
      }),
      ...(query?.includePost && {
        includePost: Boolean(query.includePost),
      }),
      ...(query?.postId && { postId: query.postId }),
      ...(query?.userId && { userId: query.userId }),
    };

    try {
      const reposts = await this.repostService.getReposts(RepostsQuery);
      const apiResponse: ApiResponse<RepostEntity[]> = {
        error: false,
        statusCode: StatusCode.OK,
        message: "Get reposts data successfully!",
        data: reposts,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      return next(error);
    }
  };

  getRepostById = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const id = request.params.id as string;

    try {
      const repost = await this.repostService.getRepostById(id);
      const apiResponse: ApiResponse<RepostEntity> = {
        error: false,
        statusCode: StatusCode.OK,
        message: "Get repost data successfully!",
        data: repost,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      return next(error);
    }
  };

  postRepost = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const data = request.body as PostRepostDTO;

    try {
      const repost = await this.repostService.postRepost(data);
      const apiResponse: ApiResponse<RepostEntity> = {
        error: false,
        statusCode: StatusCode.CREATED,
        message: "Post repost successfully!",
        data: repost,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      return next(error);
    }
  };

  deleteRepostById = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const id = request.params.id as string;

    try {
      const repost = await this.repostService.deleteRepostById(id);
      const apiResponse: ApiResponse<RepostEntity> = {
        error: false,
        statusCode: StatusCode.OK,
        message: "Delete repost successfully!",
        data: repost,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      return next(error);
    }
  };
}

export const repostController = new RepostController(repostService);
