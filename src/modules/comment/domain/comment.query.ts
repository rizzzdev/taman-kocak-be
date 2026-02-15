import type { PaginationQuery } from "../../../shared/types/pagination-query.type.js";

export interface GetCommentsQuery extends PaginationQuery {
  postId?: string;
  userId?: string;
}
