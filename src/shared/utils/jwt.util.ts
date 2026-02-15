import jwt from "jsonwebtoken";
import { envConfig } from "../configs/env.config.js";

export const encodeJWT = <T>(type: "access" | "refresh", data: T) => {
  if (type === "access") {
    const tokenSecret = envConfig.accessTokenSecret;
    return jwt.sign(data!, tokenSecret!, {
      expiresIn: "10m",
      algorithm: "HS256",
    });
  } else {
    const tokenSecret = envConfig.refreshTokenSecret;

    return jwt.sign(data!, tokenSecret!, {
      expiresIn: "2d",
      algorithm: "HS256",
    });
  }
};

export const decodeJWT = (type: "access" | "refresh", token: string) => {
  if (type === "refresh") {
    try {
      const tokenSecret = envConfig.refreshTokenSecret;
      const decodedJWT = jwt.verify(token, tokenSecret!, {
        algorithms: ["HS256"],
      });
      return decodedJWT;
    } catch {
      return "";
    }
  } else {
    const tokenSecret = envConfig.accessTokenSecret;
    try {
      const decodedJWT = jwt.verify(token!, tokenSecret!, {
        algorithms: ["HS256"],
      });
      return decodedJWT;
    } catch {
      return "";
    }
  }
};
