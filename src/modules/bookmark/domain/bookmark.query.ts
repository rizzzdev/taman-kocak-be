import type { PaginationQuery } from "../../../shared/types/pagination-query.type.js";

export interface GetBookmarksQuery extends PaginationQuery {
  postId?: string;
  userId?: string;
}
