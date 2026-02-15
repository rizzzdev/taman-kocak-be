import { prisma } from "../../../app/database/index.js";
import {
  localDateNow,
  nonDeletedDate,
} from "../../../shared/utils/date.util.js";
import type { PatchPostDTO, PostPostDTO } from "../domain/post.dto.js";
import type { PostEntity } from "../domain/post.entity.js";
import type {
  DeletePostQuery,
  GetPostQuery,
  GetPostsQuery,
  PatchPostQuery,
  PostPostQuery,
} from "../domain/post.query.js";

export interface IPostRepo {
  getPosts: (query?: GetPostsQuery) => Promise<PostEntity[]>;
  getPostById: (id: string, query?: GetPostQuery) => Promise<PostEntity | null>;
  postPost: (data: PostPostDTO, query?: PostPostQuery) => Promise<PostEntity>;
  patchPostById: (
    id: string,
    data: PatchPostDTO,
    query?: PatchPostQuery,
  ) => Promise<PostEntity>;
  deletePostById: (id: string, query?: DeletePostQuery) => Promise<PostEntity>;
}

export class PostRepo implements IPostRepo {
  getPosts = async (query?: GetPostsQuery) => {
    const posts = await prisma.post.findMany({
      where: {
        deletedAt: nonDeletedDate(),
      },
      take: query?.limit || 10,
      skip: query?.page ? query.page * (query.limit || 10) : 0,
      include: {
        user: true,
        comments: {
          where: {
            deletedAt: nonDeletedDate(),
          },
          include: {
            user: true,
          },
          omit: {
            postId: true,
            userId: true,
          },
        },
        bookmarks: {
          where: {
            deletedAt: nonDeletedDate(),
          },
          include: {
            user: true,
          },
          omit: {
            postId: true,
            userId: true,
          },
        },
        reposts: {
          where: {
            deletedAt: nonDeletedDate(),
          },
          include: {
            user: true,
          },
          omit: {
            postId: true,
            userId: true,
          },
        },
      },
    });

    const postsMapped = posts.map((post) => {
      const data: PostEntity = {
        id: post.id,
        caption: post.caption,
        imageUrl: post.imageUrl,
        ...(query?.includeUser && {
          user: {
            id: post.user.id,
            username: post.user.username,
            fullname: post.user.fullname,
            pictureUrl: post.user.pictureUrl,
            role: post.user.role as "USER",
            createdAt: post.user.createdAt,
            lastUpdatedAt: post.user.lastUpdatedAt,
            deletedAt: post.user.deletedAt,
          },
        }),
        ...(query?.includeBookmarks && {
          bookmarks: post.bookmarks.map((bookmark) => ({
            id: bookmark.id,
            user: {
              id: bookmark.user.id,
              username: bookmark.user.username,
              fullname: bookmark.user.fullname,
              pictureUrl: bookmark.user.pictureUrl,
              role: bookmark.user.role as "USER",
              createdAt: bookmark.user.createdAt,
              lastUpdatedAt: bookmark.user.lastUpdatedAt,
              deletedAt: bookmark.user.deletedAt,
            },
            createdAt: bookmark.createdAt,
            lastUpdatedAt: bookmark.lastUpdatedAt,
            deletedAt: bookmark.deletedAt,
          })),
        }),
        ...(query?.includeComments && {
          comments: post.comments.map((comment) => ({
            id: comment.id,
            text: comment.text,
            user: {
              id: comment.user.id,
              username: comment.user.username,
              fullname: comment.user.fullname,
              pictureUrl: comment.user.pictureUrl,
              role: comment.user.role as "USER",
              createdAt: comment.user.createdAt,
              lastUpdatedAt: comment.user.lastUpdatedAt,
              deletedAt: comment.user.deletedAt,
            },
            createdAt: comment.createdAt,
            lastUpdatedAt: comment.lastUpdatedAt,
            deletedAt: comment.deletedAt,
          })),
        }),
        ...(query?.includeReposts && {
          reposts: post.reposts.map((repost) => ({
            id: repost.id,
            user: {
              id: repost.user.id,
              username: repost.user.username,
              fullname: repost.user.fullname,
              pictureUrl: repost.user.pictureUrl,
              role: repost.user.role as "USER",
              createdAt: repost.user.createdAt,
              lastUpdatedAt: repost.user.lastUpdatedAt,
              deletedAt: repost.user.deletedAt,
            },
            createdAt: repost.createdAt,
            lastUpdatedAt: repost.lastUpdatedAt,
            deletedAt: repost.deletedAt,
          })),
        }),
        createdAt: post.createdAt,
        lastUpdatedAt: post.lastUpdatedAt,
        deletedAt: post.deletedAt,
      };

      return data;
    });

    return postsMapped;
  };

  getPostById = async (id: string, query?: GetPostQuery) => {
    const post = await prisma.post.findUnique({
      where: { id, deletedAt: nonDeletedDate() },
      include: {
        user: true,
        comments: {
          where: {
            deletedAt: nonDeletedDate(),
          },
          include: {
            user: true,
          },
          omit: {
            postId: true,
            userId: true,
          },
        },
        bookmarks: {
          where: {
            deletedAt: nonDeletedDate(),
          },
          include: {
            user: true,
          },
          omit: {
            postId: true,
            userId: true,
          },
        },
        reposts: {
          where: {
            deletedAt: nonDeletedDate(),
          },
          include: {
            user: true,
          },
          omit: {
            postId: true,
            userId: true,
          },
        },
      },
    });

    if (!post) {
      return null;
    }

    const data: PostEntity = {
      id: post.id,
      caption: post.caption,
      imageUrl: post.imageUrl,
      ...(query?.includeUser && {
        user: {
          id: post.user.id,
          username: post.user.username,
          fullname: post.user.fullname,
          pictureUrl: post.user.pictureUrl,
          role: post.user.role as "USER",
          createdAt: post.user.createdAt,
          lastUpdatedAt: post.user.lastUpdatedAt,
          deletedAt: post.user.deletedAt,
        },
      }),
      ...(query?.includeBookmarks && {
        bookmarks: post.bookmarks.map((bookmark) => ({
          id: bookmark.id,
          user: {
            id: bookmark.user.id,
            username: bookmark.user.username,
            fullname: bookmark.user.fullname,
            pictureUrl: bookmark.user.pictureUrl,
            role: bookmark.user.role as "USER",
            createdAt: bookmark.user.createdAt,
            lastUpdatedAt: bookmark.user.lastUpdatedAt,
            deletedAt: bookmark.user.deletedAt,
          },
          createdAt: bookmark.createdAt,
          lastUpdatedAt: bookmark.lastUpdatedAt,
          deletedAt: bookmark.deletedAt,
        })),
      }),
      ...(query?.includeComments && {
        comments: post.comments.map((comment) => ({
          id: comment.id,
          text: comment.text,
          user: {
            id: comment.user.id,
            username: comment.user.username,
            fullname: comment.user.fullname,
            pictureUrl: comment.user.pictureUrl,
            role: comment.user.role as "USER",
            createdAt: comment.user.createdAt,
            lastUpdatedAt: comment.user.lastUpdatedAt,
            deletedAt: comment.user.deletedAt,
          },
          createdAt: comment.createdAt,
          lastUpdatedAt: comment.lastUpdatedAt,
          deletedAt: comment.deletedAt,
        })),
      }),
      ...(query?.includeReposts && {
        reposts: post.reposts.map((repost) => ({
          id: repost.id,
          user: {
            id: repost.user.id,
            username: repost.user.username,
            fullname: repost.user.fullname,
            pictureUrl: repost.user.pictureUrl,
            role: repost.user.role as "USER",
            createdAt: repost.user.createdAt,
            lastUpdatedAt: repost.user.lastUpdatedAt,
            deletedAt: repost.user.deletedAt,
          },
          createdAt: repost.createdAt,
          lastUpdatedAt: repost.lastUpdatedAt,
          deletedAt: repost.deletedAt,
        })),
      }),
      createdAt: post.createdAt,
      lastUpdatedAt: post.lastUpdatedAt,
      deletedAt: post.deletedAt,
    };

    return data;
  };

  postPost = async (data: PostPostDTO, query?: PostPostQuery) => {
    const post = await prisma.post.create({
      data: {
        caption: data.caption,
        imageUrl: data.imageUrl || null,
        userId: data.userId,
        createdAt: localDateNow(),
        deletedAt: nonDeletedDate(),
      },
      include: {
        user: true,
      },
    });

    const _data: PostEntity = {
      id: post.id,
      caption: post.caption,
      imageUrl: post.imageUrl,
      ...(query?.includeUser && {
        user: {
          id: post.user.id,
          username: post.user.username,
          fullname: post.user.fullname,
          pictureUrl: post.user.pictureUrl,
          role: post.user.role as "USER",
          createdAt: post.user.createdAt,
          lastUpdatedAt: post.user.lastUpdatedAt,
          deletedAt: post.user.deletedAt,
        },
      }),
      ...(query?.includeBookmarks && {
        bookmarks: [],
      }),
      ...(query?.includeComments && {
        comments: [],
      }),
      ...(query?.includeReposts && {
        reposts: [],
      }),
      createdAt: post.createdAt,
      lastUpdatedAt: post.lastUpdatedAt,
      deletedAt: post.deletedAt,
    };

    return _data;
  };

  patchPostById = async (
    id: string,
    data: PatchPostDTO,
    query?: PatchPostQuery,
  ) => {
    const post = await prisma.post.update({
      where: {
        id,
        deletedAt: nonDeletedDate(),
      },
      data: {
        ...(data.caption && { caption: data.caption }),
        ...(data.imageUrl && { imageUrl: data.imageUrl }),
        lastUpdatedAt: localDateNow(),
      },
      include: {
        user: true,
        comments: {
          where: {
            deletedAt: nonDeletedDate(),
          },
          include: {
            user: true,
          },
          omit: {
            postId: true,
            userId: true,
          },
        },
        bookmarks: {
          where: {
            deletedAt: nonDeletedDate(),
          },
          include: {
            user: true,
          },
          omit: {
            postId: true,
            userId: true,
          },
        },
        reposts: {
          where: {
            deletedAt: nonDeletedDate(),
          },
          include: {
            user: true,
          },
          omit: {
            postId: true,
            userId: true,
          },
        },
      },
    });

    const _data: PostEntity = {
      id: post.id,
      caption: post.caption,
      imageUrl: post.imageUrl,
      ...(query?.includeUser && {
        user: {
          id: post.user.id,
          username: post.user.username,
          fullname: post.user.fullname,
          pictureUrl: post.user.pictureUrl,
          role: post.user.role as "USER",
          createdAt: post.user.createdAt,
          lastUpdatedAt: post.user.lastUpdatedAt,
          deletedAt: post.user.deletedAt,
        },
      }),
      ...(query?.includeBookmarks && {
        bookmarks: post.bookmarks.map((bookmark) => ({
          id: bookmark.id,
          user: {
            id: bookmark.user.id,
            username: bookmark.user.username,
            fullname: bookmark.user.fullname,
            pictureUrl: bookmark.user.pictureUrl,
            role: bookmark.user.role as "USER",
            createdAt: bookmark.user.createdAt,
            lastUpdatedAt: bookmark.user.lastUpdatedAt,
            deletedAt: bookmark.user.deletedAt,
          },
          createdAt: bookmark.createdAt,
          lastUpdatedAt: bookmark.lastUpdatedAt,
          deletedAt: bookmark.deletedAt,
        })),
      }),
      ...(query?.includeComments && {
        comments: post.comments.map((comment) => ({
          id: comment.id,
          text: comment.text,
          user: {
            id: comment.user.id,
            username: comment.user.username,
            fullname: comment.user.fullname,
            pictureUrl: comment.user.pictureUrl,
            role: comment.user.role as "USER",
            createdAt: comment.user.createdAt,
            lastUpdatedAt: comment.user.lastUpdatedAt,
            deletedAt: comment.user.deletedAt,
          },
          createdAt: comment.createdAt,
          lastUpdatedAt: comment.lastUpdatedAt,
          deletedAt: comment.deletedAt,
        })),
      }),
      ...(query?.includeReposts && {
        reposts: post.reposts.map((repost) => ({
          id: repost.id,
          user: {
            id: repost.user.id,
            username: repost.user.username,
            fullname: repost.user.fullname,
            pictureUrl: repost.user.pictureUrl,
            role: repost.user.role as "USER",
            createdAt: repost.user.createdAt,
            lastUpdatedAt: repost.user.lastUpdatedAt,
            deletedAt: repost.user.deletedAt,
          },
          createdAt: repost.createdAt,
          lastUpdatedAt: repost.lastUpdatedAt,
          deletedAt: repost.deletedAt,
        })),
      }),
      createdAt: post.createdAt,
      lastUpdatedAt: post.lastUpdatedAt,
      deletedAt: post.deletedAt,
    };

    return _data;
  };

  deletePostById = async (id: string, query?: DeletePostQuery) => {
    const post = await prisma.$transaction(async (tx) => {
      const post = await tx.post.update({
        where: {
          id,
          deletedAt: nonDeletedDate(),
        },
        data: {
          deletedAt: localDateNow(),
        },
        include: {
          user: true,
        },
      });

      await tx.comment.updateMany({
        where: {
          postId: id,
          deletedAt: nonDeletedDate(),
        },
        data: {
          deletedAt: localDateNow(),
        },
      });

      await tx.bookmark.updateMany({
        where: {
          postId: id,
          deletedAt: nonDeletedDate(),
        },
        data: {
          deletedAt: localDateNow(),
        },
      });

      await tx.repost.updateMany({
        where: {
          postId: id,
          deletedAt: nonDeletedDate(),
        },
        data: {
          deletedAt: localDateNow(),
        },
      });

      const data: PostEntity = {
        id: post.id,
        caption: post.caption,
        imageUrl: post.imageUrl,
        ...(query?.includeUser && {
          user: {
            id: post.user.id,
            username: post.user.username,
            fullname: post.user.fullname,
            pictureUrl: post.user.pictureUrl,
            role: post.user.role as "USER",
            createdAt: post.user.createdAt,
            lastUpdatedAt: post.user.lastUpdatedAt,
            deletedAt: post.user.deletedAt,
          },
        }),
        ...(query?.includeBookmarks && {
          bookmarks: [],
        }),
        ...(query?.includeComments && {
          comments: [],
        }),
        ...(query?.includeReposts && {
          reposts: [],
        }),
        createdAt: post.createdAt,
        lastUpdatedAt: post.lastUpdatedAt,
        deletedAt: post.deletedAt,
      };

      return data;
    });

    return post;
  };
}

export const postRepo = new PostRepo();
