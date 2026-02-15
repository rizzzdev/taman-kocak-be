import type { PaginationQuery } from "../../../shared/types/pagination-query.type.js";

export interface GetPostQuery {
  includeUser?: boolean;
  includeComments?: boolean;
  includeReposts?: boolean;
  includeBookmarks?: boolean;
}

export interface GetPostsQuery extends GetPostQuery, PaginationQuery {}

export interface PostPostQuery extends GetPostQuery {}

export interface PatchPostQuery extends GetPostQuery {}

export interface DeletePostQuery extends GetPostQuery {}
