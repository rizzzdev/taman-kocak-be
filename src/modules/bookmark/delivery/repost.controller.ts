import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../../shared/errors/index.js";
import type { GetBookmarksQuery } from "../domain/bookmark.query.js";
import {
  StatusCode,
  type ApiResponse,
} from "../../../shared/types/api-response.type.js";
import type { BookmarkEntity } from "../domain/bookmark.entity.js";
import type {
  PatchBookmarkDTO,
  PostBookmarkDTO,
} from "../domain/bookmark.dto.js";
import {
  bookmarkService,
  type IBookmarkService,
} from "../service/repost.service.js";

export class BookmarkController {
  constructor(private readonly BookmarkService: IBookmarkService) {}

  getBookmarks = async (
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

    const BookmarksQuery: GetBookmarksQuery = {
      ...(query.limit && { limit: Number(query.limit) }),
      ...(query.page && { page: Number(query.page) }),
      ...(query?.postId && { postId: query.postId }),
      ...(query?.userId && { userId: query.userId }),
    };

    try {
      const bookmarks = await this.BookmarkService.getBookmarks(BookmarksQuery);
      const apiResponse: ApiResponse<BookmarkEntity[]> = {
        error: false,
        statusCode: StatusCode.OK,
        message: "Get bookmarks data successfully!",
        data: bookmarks,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      return next(error);
    }
  };

  getBookmarkById = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const id = request.params.id as string;

    try {
      const bookmark = await this.BookmarkService.getBookmarkById(id);
      const apiResponse: ApiResponse<BookmarkEntity> = {
        error: false,
        statusCode: StatusCode.OK,
        message: "Get bookmark data successfully!",
        data: bookmark,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      return next(error);
    }
  };

  postBookmark = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const data = request.body as PostBookmarkDTO;

    try {
      const bookmark = await this.BookmarkService.postBookmark(data);
      const apiResponse: ApiResponse<BookmarkEntity> = {
        error: false,
        statusCode: StatusCode.CREATED,
        message: "Post bookmark successfully!",
        data: bookmark,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      return next(error);
    }
  };

  deleteBookmarkById = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const id = request.params.id as string;

    try {
      const bookmark = await this.BookmarkService.deleteBookmarkById(id);
      const apiResponse: ApiResponse<BookmarkEntity> = {
        error: false,
        statusCode: StatusCode.OK,
        message: "Delete bookmark successfully!",
        data: bookmark,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      return next(error);
    }
  };
}

export const bookmarkController = new BookmarkController(bookmarkService);
