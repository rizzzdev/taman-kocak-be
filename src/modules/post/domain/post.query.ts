import type { PaginationQuery } from "../../../shared/types/pagination-query.type.js";

export interface GetPostQuery {
  includeUser?: boolean;
  includeComments?: boolean;
  includeLikes?: boolean;
  includeReposts?: boolean;
  includeBookmarks?: boolean;
}

export interface GetPostsQuery extends GetPostQuery, PaginationQuery {
  userId?: string;
  includeAll?: boolean;
  isTrending?: boolean;
}

export interface PostPostQuery extends GetPostQuery {}

export interface PatchPostQuery extends GetPostQuery {}

export interface DeletePostQuery extends GetPostQuery {}
