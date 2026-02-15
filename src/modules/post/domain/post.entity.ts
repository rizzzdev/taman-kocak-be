import type { BookmarkEntity } from "../../bookmark/domain/bookmark.entity.js";
import type { CommentEntity } from "../../comment/domain/comment.entity.js";
import type { RepostEntity } from "../../repost/domain/repost.entity.js";
import type { UserEntity } from "../../user/domain/user.entity.js";

export interface PostEntity {
  id: string;
  caption: string;
  imageUrl: string | null;
  user?: UserEntity;
  comments?: CommentEntity[];
  reposts?: RepostEntity[];
  bookmarks?: BookmarkEntity[];
  createdAt: Date;
  lastUpdatedAt: Date | null;
  deletedAt: Date;
}
