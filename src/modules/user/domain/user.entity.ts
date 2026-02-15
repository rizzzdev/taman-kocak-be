import type { BookmarkEntity } from "../../bookmark/domain/bookmark.entity.js";
import type { CommentEntity } from "../../comment/domain/comment.entity.js";
import type { PostEntity } from "../../post/domain/post.entity.js";
import type { RepostEntity } from "../../repost/domain/repost.entity.js";
import type { SessionEntity } from "../../session/domain/session.entity.js";

export interface UserEntity {
  id: string;
  fullname: string;
  pictureUrl: string | null;
  username: string;
  password?: string;
  role: "USER";
  sessions?: SessionEntity[];
  posts?: PostEntity[];
  comments?: CommentEntity[];
  reposts?: RepostEntity[];
  bookmarks?: BookmarkEntity[];
  createdAt: Date;
  lastUpdatedAt: Date | null;
  deletedAt: Date;
}
