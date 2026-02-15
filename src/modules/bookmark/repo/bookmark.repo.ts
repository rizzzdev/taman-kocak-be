import { prisma } from "../../../app/database/index.js";
import {
  localDateNow,
  nonDeletedDate,
} from "../../../shared/utils/date.util.js";
import type { PostEntity } from "../../post/domain/post.entity.js";
import type { UserEntity } from "../../user/domain/user.entity.js";
import type {
  PatchBookmarkDTO,
  PostBookmarkDTO,
} from "../domain/bookmark.dto.js";
import type { BookmarkEntity } from "../domain/bookmark.entity.js";
import type { GetBookmarksQuery } from "../domain/bookmark.query.js";

export interface IBookmarkRepo {
  getBookmarks: (query?: GetBookmarksQuery) => Promise<BookmarkEntity[]>;
  getBookmarkById: (id: string) => Promise<BookmarkEntity | null>;
  postBookmark: (data: PostBookmarkDTO) => Promise<BookmarkEntity>;
  deleteBookmarkById: (id: string) => Promise<BookmarkEntity>;
}

export class BookmarkRepo implements IBookmarkRepo {
  getBookmarks = async (query?: GetBookmarksQuery) => {
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        deletedAt: nonDeletedDate(),
        ...(query?.postId && { postId: query.postId }),
        ...(query?.userId && { userId: query.userId }),
      },
      take: query?.limit || 10,
      skip: query?.page ? query.page * (query.limit || 10) : 0,
      include: {
        post: {
          include: {
            user: true,
          },
          omit: {
            userId: true,
          },
        },
        user: true,
      },
    });

    const BookmarksMapped = bookmarks.map((bookmark) => {
      const userData: UserEntity = {
        id: bookmark.user.id,
        fullname: bookmark.user.fullname,
        pictureUrl: bookmark.user.pictureUrl,
        username: bookmark.user.username,
        role: bookmark.user.role as "USER",
        createdAt: bookmark.user.createdAt,
        lastUpdatedAt: bookmark.user.lastUpdatedAt,
        deletedAt: bookmark.user.deletedAt,
      };

      const postData: PostEntity = {
        id: bookmark.post.id,
        caption: bookmark.post.caption,
        imageUrl: bookmark.post.imageUrl,
        user: {
          id: bookmark.post.user.id,
          fullname: bookmark.post.user.fullname,
          pictureUrl: bookmark.post.user.pictureUrl,
          username: bookmark.post.user.username,
          role: bookmark.post.user.role as "USER",
          createdAt: bookmark.post.user.createdAt,
          lastUpdatedAt: bookmark.post.user.lastUpdatedAt,
          deletedAt: bookmark.post.user.deletedAt,
        },
        createdAt: bookmark.post.createdAt,
        lastUpdatedAt: bookmark.post.lastUpdatedAt,
        deletedAt: bookmark.post.deletedAt,
      };

      const data: BookmarkEntity = {
        id: bookmark.id,
        post: postData,
        user: userData,
        createdAt: bookmark.createdAt,
        lastUpdatedAt: bookmark.lastUpdatedAt,
        deletedAt: bookmark.deletedAt,
      };

      return data;
    });

    return BookmarksMapped;
  };

  getBookmarkById = async (id: string) => {
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        id,
        deletedAt: nonDeletedDate(),
      },
      include: {
        post: {
          include: {
            user: true,
          },
          omit: {
            userId: true,
          },
        },
        user: true,
      },
    });

    if (!bookmark) {
      return null;
    }

    const userData: UserEntity = {
      id: bookmark.user.id,
      fullname: bookmark.user.fullname,
      pictureUrl: bookmark.user.pictureUrl,
      username: bookmark.user.username,
      role: bookmark.user.role as "USER",
      createdAt: bookmark.user.createdAt,
      lastUpdatedAt: bookmark.user.lastUpdatedAt,
      deletedAt: bookmark.user.deletedAt,
    };

    const postData: PostEntity = {
      id: bookmark.post.id,
      caption: bookmark.post.caption,
      imageUrl: bookmark.post.imageUrl,
      user: {
        id: bookmark.post.user.id,
        fullname: bookmark.post.user.fullname,
        pictureUrl: bookmark.post.user.pictureUrl,
        username: bookmark.post.user.username,
        role: bookmark.post.user.role as "USER",
        createdAt: bookmark.post.user.createdAt,
        lastUpdatedAt: bookmark.post.user.lastUpdatedAt,
        deletedAt: bookmark.post.user.deletedAt,
      },
      createdAt: bookmark.post.createdAt,
      lastUpdatedAt: bookmark.post.lastUpdatedAt,
      deletedAt: bookmark.post.deletedAt,
    };

    const data: BookmarkEntity = {
      id: bookmark.id,
      post: postData,
      user: userData,
      createdAt: bookmark.createdAt,
      lastUpdatedAt: bookmark.lastUpdatedAt,
      deletedAt: bookmark.deletedAt,
    };

    return data;
  };

  postBookmark = async (data: PostBookmarkDTO) => {
    const bookmark = await prisma.bookmark.create({
      data: {
        createdAt: localDateNow(),
        deletedAt: nonDeletedDate(),
        post: {
          connect: {
            id: data.postId,
          },
        },
        user: {
          connect: {
            id: data.userId,
          },
        },
      },
      include: {
        post: {
          include: {
            user: true,
          },
          omit: {
            userId: true,
          },
        },
        user: true,
      },
    });

    const userData: UserEntity = {
      id: bookmark.user.id,
      fullname: bookmark.user.fullname,
      pictureUrl: bookmark.user.pictureUrl,
      username: bookmark.user.username,
      role: bookmark.user.role as "USER",
      createdAt: bookmark.user.createdAt,
      lastUpdatedAt: bookmark.user.lastUpdatedAt,
      deletedAt: bookmark.user.deletedAt,
    };

    const postData: PostEntity = {
      id: bookmark.post.id,
      caption: bookmark.post.caption,
      imageUrl: bookmark.post.imageUrl,
      user: {
        id: bookmark.post.user.id,
        fullname: bookmark.post.user.fullname,
        pictureUrl: bookmark.post.user.pictureUrl,
        username: bookmark.post.user.username,
        role: bookmark.post.user.role as "USER",
        createdAt: bookmark.post.user.createdAt,
        lastUpdatedAt: bookmark.post.user.lastUpdatedAt,
        deletedAt: bookmark.post.user.deletedAt,
      },
      createdAt: bookmark.post.createdAt,
      lastUpdatedAt: bookmark.post.lastUpdatedAt,
      deletedAt: bookmark.post.deletedAt,
    };

    const _data: BookmarkEntity = {
      id: bookmark.id,

      post: postData,
      user: userData,
      createdAt: bookmark.createdAt,
      lastUpdatedAt: bookmark.lastUpdatedAt,
      deletedAt: bookmark.deletedAt,
    };

    return _data;
  };

  deleteBookmarkById = async (id: string) => {
    const bookmark = await prisma.bookmark.update({
      where: {
        id,
        deletedAt: nonDeletedDate(),
      },
      data: {
        deletedAt: localDateNow(),
      },
      include: {
        post: {
          include: {
            user: true,
          },
          omit: {
            userId: true,
          },
        },
        user: true,
      },
    });

    const userData: UserEntity = {
      id: bookmark.user.id,
      fullname: bookmark.user.fullname,
      pictureUrl: bookmark.user.pictureUrl,
      username: bookmark.user.username,
      role: bookmark.user.role as "USER",
      createdAt: bookmark.user.createdAt,
      lastUpdatedAt: bookmark.user.lastUpdatedAt,
      deletedAt: bookmark.user.deletedAt,
    };

    const postData: PostEntity = {
      id: bookmark.post.id,
      caption: bookmark.post.caption,
      imageUrl: bookmark.post.imageUrl,
      user: {
        id: bookmark.post.user.id,
        fullname: bookmark.post.user.fullname,
        pictureUrl: bookmark.post.user.pictureUrl,
        username: bookmark.post.user.username,
        role: bookmark.post.user.role as "USER",
        createdAt: bookmark.post.user.createdAt,
        lastUpdatedAt: bookmark.post.user.lastUpdatedAt,
        deletedAt: bookmark.post.user.deletedAt,
      },
      createdAt: bookmark.post.createdAt,
      lastUpdatedAt: bookmark.post.lastUpdatedAt,
      deletedAt: bookmark.post.deletedAt,
    };

    const data: BookmarkEntity = {
      id: bookmark.id,

      post: postData,
      user: userData,
      createdAt: bookmark.createdAt,
      lastUpdatedAt: bookmark.lastUpdatedAt,
      deletedAt: bookmark.deletedAt,
    };

    return data;
  };
}

export const bookmarkRepo = new BookmarkRepo();
