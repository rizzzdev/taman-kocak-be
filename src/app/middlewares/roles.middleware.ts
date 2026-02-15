// import type { NextFunction, Request, Response } from "express";
// import { ForbiddenError } from "../../shared/errors/index.js";
// import type { Role } from "../../shared/types/role.type.js";

// export const rolesMiddleware = (roles: Role[]) => {
//   return async (request: Request, response: Response, next: NextFunction) => {
//     const role = request.headers.role as Role;

//     if (role === "SUPER_ADMIN") {
//       next("router");
//       return;
//     }

//     if (roles.includes(role)) {
//       next();
//       return;
//     }

//     throw new ForbiddenError("You are not have permission!");
//   };
// };
