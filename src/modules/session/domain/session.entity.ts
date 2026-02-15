import type { UserEntity } from "../../user/domain/user.entity.js";

export interface SessionEntity {
  id: string;
  refreshToken: string | null;
  ip: string;
  userAgent: string;
  user?: UserEntity;
  createdAt: Date;
  lastUpdatedAt: Date | null;
  deletedAt: Date;
}
