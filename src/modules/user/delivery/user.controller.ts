import type { NextFunction, Request, Response } from "express";
import { userService, type UserService } from "../service/user.service.js";
import type {
  DeleteUserQuery,
  GetUserQuery,
  GetUsersQuery,
  PatchUserQuery,
  PostUserQuery,
} from "../domain/user.query.js";
import {
  StatusCode,
  type ApiResponse,
} from "../../../shared/types/api-response.type.js";
import type { UserEntity } from "../domain/user.entity.js";
import type { PatchUserDTO, PostUserDTO } from "../domain/user.dto.js";
import { BadRequestError } from "../../../shared/errors/index.js";

export class UserController {
  constructor(private readonly userService: UserService) {}

  getUsers = async (
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

    const usersQuery: GetUsersQuery = {
      ...(query.username && { username: query.username }),
      ...(query.fullname && { fullname: query.fullname }),
      ...(query.limit && { limit: Number(query.limit) }),
      ...(query.page && { page: Number(query.page) }),
      ...(query?.includeSessions && {
        includeSessions: Boolean(query.includeSessions),
      }),
      ...(query?.includePosts && { includePosts: Boolean(query.includePosts) }),
      ...(query?.includeComments && {
        includeComments: Boolean(query.includeComments),
      }),
      ...(query?.includeLikes && {
        includeLikes: Boolean(query.includeLikes),
      }),
      ...(query?.includeReposts && {
        includeReposts: Boolean(query.includeReposts),
      }),
      ...(query?.includeBookmarks && {
        includeBookmarks: Boolean(query.includeBookmarks),
      }),
    };

    try {
      const users = await this.userService.getUsers(usersQuery);
      const apiResponse: ApiResponse<UserEntity[]> = {
        error: false,
        statusCode: StatusCode.OK,
        message: "Get users data successfully!",
        data: users,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const id = request.params.id as string;
    const query = request.query as Record<string, string>;
    const userQuery: GetUserQuery = {
      ...(query?.includeSessions && {
        includeSessions: Boolean(query.includeSessions),
      }),
      ...(query?.includePosts && { includePosts: Boolean(query.includePosts) }),
      ...(query?.includeComments && {
        includeComments: Boolean(query.includeComments),
      }),
      ...(query?.includeLikes && {
        includeLikes: Boolean(query.includeLikes),
      }),
      ...(query?.includeReposts && {
        includeReposts: Boolean(query.includeReposts),
      }),
      ...(query?.includeBookmarks && {
        includeBookmarks: Boolean(query.includeBookmarks),
      }),
    };

    try {
      const user = await this.userService.getUserById(id, userQuery);
      const apiResponse: ApiResponse<UserEntity> = {
        error: false,
        statusCode: StatusCode.OK,
        message: "Get user data successfully!",
        data: user,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      next(error);
    }
  };

  postUser = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const data = request.body as PostUserDTO;

    const query = request.query as Record<string, string>;
    const userQuery: PostUserQuery = {
      ...(query?.includeSessions && {
        includeSessions: Boolean(query.includeSessions),
      }),
      ...(query?.includePosts && { includePosts: Boolean(query.includePosts) }),
      ...(query?.includeComments && {
        includeComments: Boolean(query.includeComments),
      }),
      ...(query?.includeLikes && {
        includeLikes: Boolean(query.includeLikes),
      }),
      ...(query?.includeReposts && {
        includeReposts: Boolean(query.includeReposts),
      }),
      ...(query?.includeBookmarks && {
        includeBookmarks: Boolean(query.includeBookmarks),
      }),
    };

    try {
      const user = await this.userService.postUser(data, userQuery);
      const apiResponse: ApiResponse<UserEntity> = {
        error: false,
        statusCode: StatusCode.CREATED,
        message: "Post user data successfully!",
        data: user,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      next(error);
    }
  };

  patchUserById = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const id = request.params.id as string;
    const data = request.body as PatchUserDTO;
    const query = request.query as Record<string, string>;
    const userQuery: PatchUserQuery = {
      ...(query?.includeSessions && {
        includeSessions: Boolean(query.includeSessions),
      }),
      ...(query?.includeLikes && {
        includeLikes: Boolean(query.includeLikes),
      }),
      ...(query?.includePosts && { includePosts: Boolean(query.includePosts) }),
      ...(query?.includeComments && {
        includeComments: Boolean(query.includeComments),
      }),
      ...(query?.includeReposts && {
        includeReposts: Boolean(query.includeReposts),
      }),
      ...(query?.includeBookmarks && {
        includeBookmarks: Boolean(query.includeBookmarks),
      }),
    };

    try {
      const user = await this.userService.patchUserById(id, data, userQuery);
      const apiResponse: ApiResponse<UserEntity> = {
        error: false,
        statusCode: StatusCode.OK,
        message: "Patch user data successfully!",
        data: user,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      next(error);
    }
  };

  deleteUserById = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const id = request.params.id as string;
    const query = request.query as Record<string, string>;
    const userQuery: DeleteUserQuery = {
      ...(query?.includeSessions && {
        includeSessions: Boolean(query.includeSessions),
      }),
      ...(query?.includePosts && { includePosts: Boolean(query.includePosts) }),
      ...(query?.includeComments && {
        includeComments: Boolean(query.includeComments),
      }),
      ...(query?.includeLikes && {
        includeLikes: Boolean(query.includeLikes),
      }),
      ...(query?.includeReposts && {
        includeReposts: Boolean(query.includeReposts),
      }),
      ...(query?.includeBookmarks && {
        includeBookmarks: Boolean(query.includeBookmarks),
      }),
    };

    try {
      const user = await this.userService.deleteUserById(id, userQuery);
      const apiResponse: ApiResponse<UserEntity> = {
        error: false,
        statusCode: StatusCode.OK,
        message: "Delete user data successfully!",
        data: user,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController(userService);
