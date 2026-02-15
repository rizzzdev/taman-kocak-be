import { UnauthorizedError } from "../../../shared/errors/index.js";
import { decodeJWT, encodeJWT } from "../../../shared/utils/jwt.util.js";
import {
  sessionService,
  type ISessionService,
} from "../../session/service/session.service.js";

export interface IAccessTokenService {
  postAccessToken(refreshToken: string): Promise<string>;
}

export class AccessTokenService implements IAccessTokenService {
  constructor(private readonly sessionService: ISessionService) {}

  postAccessToken = async (refreshToken: string) => {
    const isRefreshTokenValid = decodeJWT("refresh", refreshToken);
    if (!isRefreshTokenValid) {
      throw new UnauthorizedError("You are not authenticated!");
    }

    const isSessionExist = await this.sessionService.getSessions({
      refreshToken,
    });
    if (isSessionExist.length === 0) {
      throw new UnauthorizedError("You are not authenticated!");
    }

    const accessToken = encodeJWT("access", {
      sessionId: isSessionExist[0]!.id,
    });

    return accessToken;
  };
}

export const accessTokenService = new AccessTokenService(sessionService);
