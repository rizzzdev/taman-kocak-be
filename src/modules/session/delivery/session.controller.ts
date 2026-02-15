import type { NextFunction, Request, Response } from "express";
import type {
  DeleteSessionQuery,
  GetSessionQuery,
  GetSessionsQuery,
  PostSessionQuery,
} from "../domain/session.query.js";
import {
  StatusCode,
  type ApiResponse,
} from "../../../shared/types/api-response.type.js";
import type { SessionEntity } from "../domain/session.entity.js";
import {
  sessionService,
  type ISessionService,
} from "../service/session.service.js";
import type { PostSessionDTO } from "../domain/session.dto.js";
import { envConfig } from "../../../shared/configs/env.config.js";
import { BadRequestError } from "../../../shared/errors/index.js";

export class SessionController {
  constructor(private readonly sessionService: ISessionService) {}

  getSessions = async (
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

    const sessionsQuery: GetSessionsQuery = {
      ...(query.limit && { limit: Number(query.limit) }),
      ...(query.page && { page: Number(query.page) }),
      ...(query?.includeUser && {
        includeUser: Boolean(query.includeUser),
      }),
      refreshToken: query.refreshToken as string,
    };

    try {
      const sessions = await this.sessionService.getSessions(sessionsQuery);
      const apiResponse: ApiResponse<SessionEntity[]> = {
        error: false,
        statusCode: StatusCode.OK,
        message: "Get sessions data successfully!",
        data: sessions,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      return next(error);
    }
  };

  getSessionById = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const id = request.params.id as string;
    const query = request.query as Record<string, string>;

    const sessionsQuery: GetSessionQuery = {
      ...(query?.includeUser && {
        includeUser: Boolean(query.includeUser),
      }),
    };

    try {
      const session = await this.sessionService.getSessionById(
        id,
        sessionsQuery,
      );
      const apiResponse: ApiResponse<SessionEntity> = {
        error: false,
        statusCode: StatusCode.OK,
        message: "Get session data successfully!",
        data: session,
        pagination: null,
      };

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      return next(error);
    }
  };

  postSession = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const data = request.body as PostSessionDTO;
    const ip = request.ip!;
    const userAgent = request.headers["user-agent"] as string;

    const query = request.query as Record<string, string>;

    const sessionsQuery: PostSessionQuery = {
      ...(query?.includeUser && {
        includeUser: Boolean(query.includeUser),
      }),
    };

    try {
      const session = await this.sessionService.postSession(
        { ...data, ip, userAgent },
        sessionsQuery,
      );
      const apiResponse: ApiResponse<SessionEntity & { accessToken: string }> =
        {
          error: false,
          statusCode: StatusCode.CREATED,
          message: "Post session data successfully!",
          data: session,
          pagination: null,
        };

      const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

      response.cookie("refreshToken", session.refreshToken, {
        httpOnly: true,
        secure: envConfig.nodeEnv === "prod",
        maxAge: 2 * DAY_IN_MILLISECONDS,
      });

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      return next(error);
    }
  };

  deleteSessionById = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const id = request.params.id as string;
    const query = request.query as Record<string, string>;

    const sessionsQuery: DeleteSessionQuery = {
      ...(query?.includeUser && {
        includeUser: Boolean(query.includeUser),
      }),
    };

    try {
      const session = await this.sessionService.deleteSessionById(
        id,
        sessionsQuery,
      );
      const apiResponse: ApiResponse<SessionEntity> = {
        error: false,
        statusCode: StatusCode.OK,
        message: "Delete session data successfully!",
        data: session,
        pagination: null,
      };

      response.clearCookie("refreshToken");

      return response.status(apiResponse.statusCode).json(apiResponse);
    } catch (error) {
      return next(error);
    }
  };
}

export const sessionController = new SessionController(sessionService);
