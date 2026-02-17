import { prisma } from "../../../app/database/index.js";
import {
  localDateNow,
  nonDeletedDate,
} from "../../../shared/utils/date.util.js";
import type { PostEntity } from "../../post/domain/post.entity.js";
import type { UserEntity } from "../../user/domain/user.entity.js";
import type { PatchCommentDTO, PostCommentDTO } from "../domain/comment.dto.js";
import type { CommentEntity } from "../domain/comment.entity.js";
import type { GetCommentsQuery } from "../domain/comment.query.js";

export interface ICommentRepo {
  getComments: (query?: GetCommentsQuery) => Promise<CommentEntity[]>;
  getCommentById: (id: string) => Promise<CommentEntity | null>;
  postComment: (data: PostCommentDTO) => Promise<CommentEntity>;
  patchCommentById: (
    id: string,
    data: PatchCommentDTO,
  ) => Promise<CommentEntity>;
  deleteCommentById: (id: string) => Promise<CommentEntity>;
}

export class CommentRepo implements ICommentRepo {
  getComments = async (query?: GetCommentsQuery) => {
    const comments = await prisma.comment.findMany({
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

    const commentsMapped = comments.map((comment) => {
      const userData: UserEntity = {
        id: comment.user.id,
        fullname: comment.user.fullname,
        pictureUrl: comment.user.pictureUrl,
        username: comment.user.username,
        role: comment.user.role as "USER",
        createdAt: comment.user.createdAt,
        lastUpdatedAt: comment.user.lastUpdatedAt,
        deletedAt: comment.user.deletedAt,
      };

      const postData: PostEntity = {
        id: comment.post.id,
        caption: comment.post.caption,
        imageUrl: comment.post.imageUrl,
        trendingScore: comment.post.trendingScore,
        user: {
          id: comment.post.user.id,
          fullname: comment.post.user.fullname,
          pictureUrl: comment.post.user.pictureUrl,
          username: comment.post.user.username,
          role: comment.post.user.role as "USER",
          createdAt: comment.post.user.createdAt,
          lastUpdatedAt: comment.post.user.lastUpdatedAt,
          deletedAt: comment.post.user.deletedAt,
        },
        createdAt: comment.post.createdAt,
        lastUpdatedAt: comment.post.lastUpdatedAt,
        deletedAt: comment.post.deletedAt,
      };

      const data: CommentEntity = {
        id: comment.id,
        text: comment.text,
        post: postData,
        user: userData,
        createdAt: comment.createdAt,
        lastUpdatedAt: comment.lastUpdatedAt,
        deletedAt: comment.deletedAt,
      };

      return data;
    });

    return commentsMapped;
  };

  getCommentById = async (id: string) => {
    const comment = await prisma.comment.findUnique({
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

    if (!comment) {
      return null;
    }

    const userData: UserEntity = {
      id: comment.user.id,
      fullname: comment.user.fullname,
      pictureUrl: comment.user.pictureUrl,
      username: comment.user.username,
      role: comment.user.role as "USER",
      createdAt: comment.user.createdAt,
      lastUpdatedAt: comment.user.lastUpdatedAt,
      deletedAt: comment.user.deletedAt,
    };

    const postData: PostEntity = {
      id: comment.post.id,
      caption: comment.post.caption,
      imageUrl: comment.post.imageUrl,
      trendingScore: comment.post.trendingScore,
      user: {
        id: comment.post.user.id,
        fullname: comment.post.user.fullname,
        pictureUrl: comment.post.user.pictureUrl,
        username: comment.post.user.username,
        role: comment.post.user.role as "USER",
        createdAt: comment.post.user.createdAt,
        lastUpdatedAt: comment.post.user.lastUpdatedAt,
        deletedAt: comment.post.user.deletedAt,
      },
      createdAt: comment.post.createdAt,
      lastUpdatedAt: comment.post.lastUpdatedAt,
      deletedAt: comment.post.deletedAt,
    };

    const data: CommentEntity = {
      id: comment.id,
      text: comment.text,
      post: postData,
      user: userData,
      createdAt: comment.createdAt,
      lastUpdatedAt: comment.lastUpdatedAt,
      deletedAt: comment.deletedAt,
    };

    return data;
  };

  postComment = async (data: PostCommentDTO) => {
    const comment = await prisma.comment.create({
      data: {
        text: data.text,
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
      id: comment.user.id,
      fullname: comment.user.fullname,
      pictureUrl: comment.user.pictureUrl,
      username: comment.user.username,
      role: comment.user.role as "USER",
      createdAt: comment.user.createdAt,
      lastUpdatedAt: comment.user.lastUpdatedAt,
      deletedAt: comment.user.deletedAt,
    };

    const postData: PostEntity = {
      id: comment.post.id,
      caption: comment.post.caption,
      imageUrl: comment.post.imageUrl,
      trendingScore: comment.post.trendingScore,
      user: {
        id: comment.post.user.id,
        fullname: comment.post.user.fullname,
        pictureUrl: comment.post.user.pictureUrl,
        username: comment.post.user.username,
        role: comment.post.user.role as "USER",
        createdAt: comment.post.user.createdAt,
        lastUpdatedAt: comment.post.user.lastUpdatedAt,
        deletedAt: comment.post.user.deletedAt,
      },
      createdAt: comment.post.createdAt,
      lastUpdatedAt: comment.post.lastUpdatedAt,
      deletedAt: comment.post.deletedAt,
    };

    const _data: CommentEntity = {
      id: comment.id,
      text: comment.text,
      post: postData,
      user: userData,
      createdAt: comment.createdAt,
      lastUpdatedAt: comment.lastUpdatedAt,
      deletedAt: comment.deletedAt,
    };

    return _data;
  };

  patchCommentById = async (id: string, data: PatchCommentDTO) => {
    const comment = await prisma.comment.update({
      where: {
        id,
        deletedAt: nonDeletedDate(),
      },
      data: {
        ...(data.text && { text: data.text }),
        lastUpdatedAt: localDateNow(),
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
      id: comment.user.id,
      fullname: comment.user.fullname,
      pictureUrl: comment.user.pictureUrl,
      username: comment.user.username,
      role: comment.user.role as "USER",
      createdAt: comment.user.createdAt,
      lastUpdatedAt: comment.user.lastUpdatedAt,
      deletedAt: comment.user.deletedAt,
    };

    const postData: PostEntity = {
      id: comment.post.id,
      caption: comment.post.caption,
      imageUrl: comment.post.imageUrl,
      trendingScore: comment.post.trendingScore,
      user: {
        id: comment.post.user.id,
        fullname: comment.post.user.fullname,
        pictureUrl: comment.post.user.pictureUrl,
        username: comment.post.user.username,
        role: comment.post.user.role as "USER",
        createdAt: comment.post.user.createdAt,
        lastUpdatedAt: comment.post.user.lastUpdatedAt,
        deletedAt: comment.post.user.deletedAt,
      },
      createdAt: comment.post.createdAt,
      lastUpdatedAt: comment.post.lastUpdatedAt,
      deletedAt: comment.post.deletedAt,
    };

    const _data: CommentEntity = {
      id: comment.id,
      text: comment.text,
      post: postData,
      user: userData,
      createdAt: comment.createdAt,
      lastUpdatedAt: comment.lastUpdatedAt,
      deletedAt: comment.deletedAt,
    };

    return _data;
  };

  deleteCommentById = async (id: string) => {
    const comment = await prisma.comment.update({
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
      id: comment.user.id,
      fullname: comment.user.fullname,
      pictureUrl: comment.user.pictureUrl,
      username: comment.user.username,
      role: comment.user.role as "USER",
      createdAt: comment.user.createdAt,
      lastUpdatedAt: comment.user.lastUpdatedAt,
      deletedAt: comment.user.deletedAt,
    };

    const postData: PostEntity = {
      id: comment.post.id,
      caption: comment.post.caption,
      imageUrl: comment.post.imageUrl,
      trendingScore: comment.post.trendingScore,
      user: {
        id: comment.post.user.id,
        fullname: comment.post.user.fullname,
        pictureUrl: comment.post.user.pictureUrl,
        username: comment.post.user.username,
        role: comment.post.user.role as "USER",
        createdAt: comment.post.user.createdAt,
        lastUpdatedAt: comment.post.user.lastUpdatedAt,
        deletedAt: comment.post.user.deletedAt,
      },
      createdAt: comment.post.createdAt,
      lastUpdatedAt: comment.post.lastUpdatedAt,
      deletedAt: comment.post.deletedAt,
    };

    const data: CommentEntity = {
      id: comment.id,
      text: comment.text,
      post: postData,
      user: userData,
      createdAt: comment.createdAt,
      lastUpdatedAt: comment.lastUpdatedAt,
      deletedAt: comment.deletedAt,
    };

    return data;
  };
}

export const commentRepo = new CommentRepo();
