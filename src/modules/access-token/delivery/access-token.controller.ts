import type { NextFunction, Request, Response } from "express";
import {
  accessTokenService,
  type IAccessTokenService,
} from "../service/access-token.service.js";
import {
  StatusCode,
  type ApiResponse,
} from "../../../shared/types/api-response.type.js";

export class AccessTokenController {
  constructor(private readonly accessTokenService: IAccessTokenService) {}

  postAccessToken = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const refreshToken = request.cookies.refreshToken as string;

    try {
      const accessToken =
        await this.accessTokenService.postAccessToken(refreshToken);
      const apiResponse: ApiResponse<string> = {
        error: false,
        statusCode: StatusCode.CREATED,
        message: "Access token created successfully!",
        data: accessToken,
        pagination: null,
      };

      return response.status(StatusCode.CREATED).json(apiResponse);
    } catch (error) {
      return next(error);
    }
  };
}

export const accessTokenController = new AccessTokenController(
  accessTokenService,
);
