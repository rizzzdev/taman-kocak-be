import type { PaginationQuery } from "../../../shared/types/pagination-query.type.js";

export interface GetUserQuery {
  includeSessions?: boolean;
  includePosts?: boolean;
  includeComments?: boolean;
  includeLikes?: boolean;
  includeReposts?: boolean;
  includeBookmarks?: boolean;
  includePassword?: boolean;
}

export interface GetUsersQuery extends GetUserQuery, PaginationQuery {
  username?: string;
  fullname?: string;
}

export interface PostUserQuery extends GetUserQuery {}

export interface PatchUserQuery extends GetUserQuery {}

export interface DeleteUserQuery extends GetUserQuery {}
