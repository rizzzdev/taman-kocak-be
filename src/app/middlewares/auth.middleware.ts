import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../../shared/errors/index.js";
import { decodeJWT } from "../../shared/utils/jwt.util.js";
import { sessionRepo } from "../../modules/session/repo/session.repo.js";

export const authMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  request.headers["url"] = request.url;
  request.headers["method"] = request.method;

  const excludedPathsAndMethods = [
    {
      path: "/access-tokens",
      method: "POST",
    },
    {
      path: "/users",
      method: "POST",
    },
    {
      path: "/sessions",
      method: "POST",
    },
  ];

  const isExcludedPathAndMethod = excludedPathsAndMethods.some(
    (excludedPathAndMethod) =>
      request.path.includes(excludedPathAndMethod.path) &&
      excludedPathAndMethod.method === request.method,
  );
  if (isExcludedPathAndMethod) {
    return next();
  }

  const accessToken = request.headers.authorization?.split(" ")[1] || "";
  const payload = decodeJWT("access", accessToken) as {
    sessionId: string;
  };
  if (!payload) {
    throw new UnauthorizedError("You are not authorized!");
  }

  const session = await sessionRepo.getSessionById(payload.sessionId, {
    includeUser: true,
  });

  request.headers["user-id"] = session?.user?.id;
  request.headers["user-role"] = session?.user?.role;
  request.headers["session-id"] = payload.sessionId;

  return next();
};
