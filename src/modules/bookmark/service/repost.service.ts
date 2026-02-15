import { NotFoundError } from "../../../shared/errors/index.js";
import { postRepo, type IPostRepo } from "../../post/repo/post.repo.js";
import { userRepo, type IUserRepo } from "../../user/repo/user.repo.js";
import type {
  PatchBookmarkDTO,
  PostBookmarkDTO,
} from "../domain/bookmark.dto.js";
import type { GetBookmarksQuery } from "../domain/bookmark.query.js";
import { bookmarkRepo, type IBookmarkRepo } from "../repo/bookmark.repo.js";

export interface IBookmarkService extends IBookmarkRepo {}

export class BookmarkService implements IBookmarkService {
  constructor(
    private readonly bookmarkRepo: IBookmarkRepo,
    private readonly userRepo: IUserRepo,
    private readonly postRepo: IPostRepo,
  ) {}

  getBookmarks = async (query?: GetBookmarksQuery) => {
    const bookmarks = await this.bookmarkRepo.getBookmarks(query);
    if (bookmarks.length === 0) {
      throw new NotFoundError("No bookmarks data found!");
    }

    return bookmarks;
  };

  getBookmarkById = async (id: string) => {
    const bookmark = await this.bookmarkRepo.getBookmarkById(id);
    if (!bookmark) {
      throw new NotFoundError("No bookmark data found!");
    }

    return bookmark;
  };

  postBookmark = async (data: PostBookmarkDTO) => {
    const isUserExist = await this.userRepo.getUserById(data.userId);
    if (!isUserExist) {
      throw new NotFoundError("No user data found!");
    }

    const isPostExist = await this.postRepo.getPostById(data.postId);
    if (!isPostExist) {
      throw new NotFoundError("No post data found!");
    }

    const bookmark = await this.bookmarkRepo.postBookmark(data);

    return bookmark;
  };

  deleteBookmarkById = async (id: string) => {
    const isBookmarkExist = await this.bookmarkRepo.getBookmarkById(id);
    if (!isBookmarkExist) {
      throw new NotFoundError("No bookmark data found!");
    }

    const bookmark = await this.bookmarkRepo.deleteBookmarkById(id);

    return bookmark;
  };
}

export const bookmarkService = new BookmarkService(
  bookmarkRepo,
  userRepo,
  postRepo,
);
