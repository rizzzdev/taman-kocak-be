import type { PaginationQuery } from "../../../shared/types/pagination-query.type.js";

export interface GetLikesQuery extends PaginationQuery {
  postId?: string;
  userId?: string;
}
