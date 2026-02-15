import { prisma } from "../../../app/database/index.js";
import {
  localDateNow,
  nonDeletedDate,
} from "../../../shared/utils/date.util.js";
import type { PostSessionDTO } from "../domain/session.dto.js";
import type { SessionEntity } from "../domain/session.entity.js";
import type {
  DeleteSessionQuery,
  GetSessionQuery,
  GetSessionsQuery,
  PostSessionQuery,
} from "../domain/session.query.js";

export interface ISessionRepo {
  getSessions: (query?: GetSessionsQuery) => Promise<SessionEntity[]>;
  getSessionById: (
    id: string,
    query?: GetSessionQuery,
  ) => Promise<SessionEntity | null>;
  postSession: (
    data: PostSessionDTO & {
      userAgent: string;
      ip: string;
      refreshToken: string;
    },
    query?: PostSessionQuery,
  ) => Promise<SessionEntity>;
  deleteSessionById: (
    id: string,
    query?: DeleteSessionQuery,
  ) => Promise<SessionEntity>;
}

export class SessionRepo implements ISessionRepo {
  getSessions = async (query?: GetSessionsQuery) => {
    const sessions = await prisma.session.findMany({
      where: {
        deletedAt: nonDeletedDate(),
        ...(query?.refreshToken && { refreshToken: query.refreshToken }),
      },
      include: {
        user: true,
      },
    });

    const sessionsMapped = sessions.map((session) => {
      const data: SessionEntity = {
        id: session.id,
        refreshToken: session.refreshToken,
        ip: session.ip,
        userAgent: session.userAgent,
        ...(query?.includeUser && { user: { ...session.user, role: "USER" } }),
        createdAt: session.createdAt,
        lastUpdatedAt: session.lastUpdatedAt,
        deletedAt: session.deletedAt,
      };

      return data;
    });

    return sessionsMapped;
  };

  getSessionById = async (id: string, query?: GetSessionQuery) => {
    const session = await prisma.session.findUnique({
      where: {
        id,
        deletedAt: nonDeletedDate(),
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      return null;
    }

    const data: SessionEntity = {
      id: session.id,
      refreshToken: session.refreshToken,
      ip: session.ip,
      userAgent: session.userAgent,
      ...(query?.includeUser && { user: { ...session.user, role: "USER" } }),
      createdAt: session.createdAt,
      lastUpdatedAt: session.lastUpdatedAt,
      deletedAt: session.deletedAt,
    };

    return data;
  };

  postSession = async (
    data: PostSessionDTO & {
      userAgent: string;
      ip: string;
      refreshToken: string;
    },
    query?: PostSessionQuery,
  ) => {
    const session = await prisma.session.create({
      data: {
        refreshToken: data.refreshToken,
        ip: data.ip,
        userAgent: data.userAgent,
        user: {
          connect: {
            username_deletedAt: {
              username: data.username,
              deletedAt: nonDeletedDate(),
            },
          },
        },
        createdAt: localDateNow(),
        deletedAt: nonDeletedDate(),
      },
      include: {
        user: true,
      },
    });

    const _data: SessionEntity = {
      id: session.id,
      refreshToken: session.refreshToken,
      ip: session.ip,
      userAgent: session.userAgent,
      ...(query?.includeUser && { user: { ...session.user, role: "USER" } }),
      createdAt: session.createdAt,
      lastUpdatedAt: session.lastUpdatedAt,
      deletedAt: session.deletedAt,
    };

    return _data;
  };

  deleteSessionById = async (id: string, query?: DeleteSessionQuery) => {
    const session = await prisma.session.update({
      where: {
        id,
        deletedAt: nonDeletedDate(),
      },
      data: {
        refreshToken: null,
        deletedAt: localDateNow(),
      },
      include: {
        user: true,
      },
    });

    const data: SessionEntity = {
      id: session.id,
      refreshToken: session.refreshToken,
      ip: session.ip,
      userAgent: session.userAgent,
      ...(query?.includeUser && { user: { ...session.user, role: "USER" } }),
      createdAt: session.createdAt,
      lastUpdatedAt: session.lastUpdatedAt,
      deletedAt: session.deletedAt,
    };

    return data;
  };
}

export const sessionRepo = new SessionRepo();
