import type { PaginationQuery } from "../../../shared/types/pagination-query.type.js";

export interface GetSessionQuery {
  includeUser?: boolean;
}

export interface GetSessionsQuery extends GetSessionQuery, PaginationQuery {
  refreshToken?: string;
}

export interface PostSessionQuery extends GetSessionQuery {}

export interface DeleteSessionQuery extends GetSessionQuery {}
