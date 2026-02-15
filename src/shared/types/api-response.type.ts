interface Pagination {
  dataTaken: number;
  nextCursor: string | null;
  totalData: number;
}

export interface ApiResponse<T> {
  error: boolean;
  statusCode: StatusCode;
  message: string | string[];
  data: T | null;
  pagination: Pagination | null;
}

export enum StatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  CREATED = 201,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  INTERNAL_SERVER_ERROR = 500,
}
