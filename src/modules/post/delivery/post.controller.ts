import type { NextFunction, Request, Response } from "express";
import { postService, type IPostService } from "../service/post.service.js";
import type {
  DeletePostQuery,
  GetPostQuery,
  GetPostsQuery,
  PatchPostQuery,
  PostPostQuery,
} from "../domain/post.query.js";
import {
  StatusCode,
  type ApiResponse,
} from "../../../shared/types/api-response.type.js";
import type { PostEntity } from "../domain/post.entity.js";
import type { PatchPostDTO, PostPostDTO } from "../domain/post.dto.js";
import { BadRequestError } from "../../../shared/errors/index.js";

export class PostController {
  constructor(private readonly postService: IPostService) {}

  getPosts = async (
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

    const postsQuery: GetPostsQuery = {
      ...(query.limit && { limit: Number(query.limit) }),
      ...(query.page && { page: Number(query.page) }),
      ...(query?.includeUser && {
        includeUser: Boolean(query.includeUser),
      }),
      ...(query?.includeComments && {
        includeComments: Boolean(query.includeComments),
      }),
      ...(query?.includeReposts && {
        includeReposts: Boolean(query.includeReposts),
      }),
      ...(query?.includeBookmarks && {
        includeBookmarks: Boolean(query.includeBookmarks),
      }),
      ...(query?.includeLikes && {
        includeLikes: Boolean(query.includeLikes),
      }),
      ...(query?.includeAll && {
        includeAll: Boolean(query.includeAll),
      }),
      ...(query?.isTrending && {
        isTrending: Boolean(query.isTrending),
      }),
      ...(query?.userId && {
        userId: query?.userId,
      }),
    };

    try {
      const posts = await this.postService.getPosts(postsQuery);
      const apiResponse: ApiResponse<PostEntity[]> = {
        error: false,
        statusCode: StatusCode.OK,
        message: "Get posts data successfully!",
        data: posts,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      next(error);
    }
  };

  getPostById = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const id = request.params.id as string;
    const query = request.query as Record<string, string>;

    const postQuery: GetPostQuery = {
      ...(query?.includeUser && {
        includeUser: Boolean(query.includeUser),
      }),
      ...(query?.includeComments && {
        includeComments: Boolean(query.includeComments),
      }),
      ...(query?.includeReposts && {
        includeReposts: Boolean(query.includeReposts),
      }),
      ...(query?.includeBookmarks && {
        includeBookmarks: Boolean(query.includeBookmarks),
      }),
      ...(query?.includeLikes && {
        includeLikes: Boolean(query.includeLikes),
      }),
    };

    try {
      const post = await this.postService.getPostById(id, postQuery);
      const apiResponse: ApiResponse<PostEntity> = {
        error: false,
        statusCode: StatusCode.OK,
        message: "Get post data successfully!",
        data: post,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      next(error);
    }
  };

  postPost = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const data = request.body as PostPostDTO;
    const query = request.query as Record<string, string>;

    const postQuery: PostPostQuery = {
      ...(query?.includeUser && {
        includeUser: Boolean(query.includeUser),
      }),
      ...(query?.includeComments && {
        includeComments: Boolean(query.includeComments),
      }),
      ...(query?.includeReposts && {
        includeReposts: Boolean(query.includeReposts),
      }),
      ...(query?.includeBookmarks && {
        includeBookmarks: Boolean(query.includeBookmarks),
      }),
      ...(query?.includeLikes && {
        includeLikes: Boolean(query.includeLikes),
      }),
    };

    try {
      const post = await this.postService.postPost(data, postQuery);
      const apiResponse: ApiResponse<PostEntity> = {
        error: false,
        statusCode: StatusCode.CREATED,
        message: "Post post data successfully!",
        data: post,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      next(error);
    }
  };

  patchPostById = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const id = request.params.id as string;
    const data = request.body as PatchPostDTO;

    const query = request.query as Record<string, string>;

    const postQuery: PatchPostQuery = {
      ...(query?.includeUser && {
        includeUser: Boolean(query.includeUser),
      }),
      ...(query?.includeComments && {
        includeComments: Boolean(query.includeComments),
      }),
      ...(query?.includeReposts && {
        includeReposts: Boolean(query.includeReposts),
      }),
      ...(query?.includeBookmarks && {
        includeBookmarks: Boolean(query.includeBookmarks),
      }),
      ...(query?.includeLikes && {
        includeLikes: Boolean(query.includeLikes),
      }),
    };

    try {
      const post = await this.postService.patchPostById(id, data, postQuery);
      const apiResponse: ApiResponse<PostEntity> = {
        error: false,
        statusCode: StatusCode.OK,
        message: "Patch post data successfully!",
        data: post,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      next(error);
    }
  };

  deletePostById = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const id = request.params.id as string;

    const query = request.query as Record<string, string>;

    const postQuery: DeletePostQuery = {
      ...(query?.includeUser && {
        includeUser: Boolean(query.includeUser),
      }),
      ...(query?.includeComments && {
        includeComments: Boolean(query.includeComments),
      }),
      ...(query?.includeReposts && {
        includeReposts: Boolean(query.includeReposts),
      }),
      ...(query?.includeBookmarks && {
        includeBookmarks: Boolean(query.includeBookmarks),
      }),
      ...(query?.includeLikes && {
        includeLikes: Boolean(query.includeLikes),
      }),
    };

    try {
      const post = await this.postService.deletePostById(id, postQuery);
      const apiResponse: ApiResponse<PostEntity> = {
        error: false,
        statusCode: StatusCode.OK,
        message: "Delete post data successfully!",
        data: post,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      next(error);
    }
  };
}

export const postController = new PostController(postService);
