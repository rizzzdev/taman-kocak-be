import bcrypt from "bcrypt";
import {
  BadRequestError,
  NotFoundError,
} from "../../../shared/errors/index.js";
import { encodeJWT } from "../../../shared/utils/jwt.util.js";
import { userRepo, type IUserRepo } from "../../user/repo/user.repo.js";
import type { PostSessionDTO } from "../domain/session.dto.js";
import type { SessionEntity } from "../domain/session.entity.js";
import type {
  DeleteSessionQuery,
  GetSessionQuery,
  GetSessionsQuery,
  PostSessionQuery,
} from "../domain/session.query.js";
import { sessionRepo, type ISessionRepo } from "../repo/session.repo.js";

export interface ISessionService extends ISessionRepo {
  postSession: (
    data: PostSessionDTO & { ip: string; userAgent: string },
    query?: PostSessionQuery,
  ) => Promise<SessionEntity & { accessToken: string }>;
}

export class SessionService implements ISessionService {
  constructor(
    private readonly sessionRepo: ISessionRepo,
    private readonly userRepo: IUserRepo,
  ) {}

  getSessions = async (query?: GetSessionsQuery) => {
    const sessions = await this.sessionRepo.getSessions(query);
    if (sessions.length === 0) {
      throw new NotFoundError("No sessions data found!");
    }

    return sessions;
  };

  getSessionById = async (id: string, query?: GetSessionQuery) => {
    const session = await this.sessionRepo.getSessionById(id, query);
    if (!session) {
      throw new NotFoundError("No session data found!");
    }

    return session;
  };

  postSession = async (
    data: PostSessionDTO & { ip: string; userAgent: string },
    query?: PostSessionQuery,
  ) => {
    const isUsernameExist = await this.userRepo.getUsers({
      username: data.username,
      includePassword: true,
    });
    if (isUsernameExist.length === 0) {
      throw new BadRequestError("Post session data not valid!");
    }

    const isPasswordValid = bcrypt.compareSync(
      data.password,
      isUsernameExist[0]!.password!,
    );
    if (!isPasswordValid) {
      throw new BadRequestError("Post session data not valid!");
    }

    const refreshToken = encodeJWT("refresh", {});

    const session = await this.sessionRepo.postSession(
      { ...data, refreshToken },
      query,
    );

    const accessToken = encodeJWT("access", { sessionId: session.id });

    const _data: SessionEntity & { accessToken: string } = {
      id: session.id,
      refreshToken: session.refreshToken,
      accessToken,
      ip: session.ip,
      userAgent: session.userAgent,
      ...(query?.includeUser && { user: session.user }),
      createdAt: session.createdAt,
      lastUpdatedAt: session.lastUpdatedAt,
      deletedAt: session.deletedAt,
    };

    return _data;
  };

  deleteSessionById = async (id: string, query?: DeleteSessionQuery) => {
    const existingSession = await this.sessionRepo.getSessionById(id, query);
    if (!existingSession) {
      throw new NotFoundError("No session data found!");
    }

    const session = await this.sessionRepo.deleteSessionById(id, query);

    return session;
  };
}

export const sessionService = new SessionService(sessionRepo, userRepo);
