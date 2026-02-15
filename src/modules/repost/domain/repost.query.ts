import type { PaginationQuery } from "../../../shared/types/pagination-query.type.js";

export interface GetRepostsQuery extends PaginationQuery {
  postId?: string;
  userId?: string;
}
