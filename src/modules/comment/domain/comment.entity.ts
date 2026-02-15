import type { PostEntity } from "../../post/domain/post.entity.js";
import type { UserEntity } from "../../user/domain/user.entity.js";

export interface CommentEntity {
  id: string;
  text: string;
  post?: PostEntity;
  user?: UserEntity;
  createdAt: Date;
  lastUpdatedAt: Date | null;
  deletedAt: Date;
}
