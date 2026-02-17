import { prisma } from "../../../app/database/index.js";
import {
  localDateNow,
  nonDeletedDate,
} from "../../../shared/utils/date.util.js";
import type { PostEntity } from "../../post/domain/post.entity.js";
import type { UserEntity } from "../../user/domain/user.entity.js";
import type { PatchLikeDTO, PostLikeDTO } from "../domain/like.dto.js";
import type { LikeEntity } from "../domain/like.entity.js";
import type { GetLikesQuery } from "../domain/like.query.js";

export interface ILikeRepo {
  getLikes: (query?: GetLikesQuery) => Promise<LikeEntity[]>;
  getLikeById: (id: string) => Promise<LikeEntity | null>;
  postLike: (data: PostLikeDTO) => Promise<LikeEntity>;
  deleteLikeById: (id: string) => Promise<LikeEntity>;
}

export class LikeRepo implements ILikeRepo {
  getLikes = async (query?: GetLikesQuery) => {
    const likes = await prisma.like.findMany({
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

    const LikesMapped = likes.map((like) => {
      const userData: UserEntity = {
        id: like.user.id,
        fullname: like.user.fullname,
        pictureUrl: like.user.pictureUrl,
        username: like.user.username,
        role: like.user.role as "USER",
        createdAt: like.user.createdAt,
        lastUpdatedAt: like.user.lastUpdatedAt,
        deletedAt: like.user.deletedAt,
      };

      const postData: PostEntity = {
        id: like.post.id,
        caption: like.post.caption,
        imageUrl: like.post.imageUrl,
        trendingScore: like.post.trendingScore,
        user: {
          id: like.post.user.id,
          fullname: like.post.user.fullname,
          pictureUrl: like.post.user.pictureUrl,
          username: like.post.user.username,
          role: like.post.user.role as "USER",
          createdAt: like.post.user.createdAt,
          lastUpdatedAt: like.post.user.lastUpdatedAt,
          deletedAt: like.post.user.deletedAt,
        },
        createdAt: like.post.createdAt,
        lastUpdatedAt: like.post.lastUpdatedAt,
        deletedAt: like.post.deletedAt,
      };

      const data: LikeEntity = {
        id: like.id,
        post: postData,
        user: userData,
        createdAt: like.createdAt,
        lastUpdatedAt: like.lastUpdatedAt,
        deletedAt: like.deletedAt,
      };

      return data;
    });

    return LikesMapped;
  };

  getLikeById = async (id: string) => {
    const like = await prisma.like.findUnique({
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

    if (!like) {
      return null;
    }

    const userData: UserEntity = {
      id: like.user.id,
      fullname: like.user.fullname,
      pictureUrl: like.user.pictureUrl,
      username: like.user.username,
      role: like.user.role as "USER",
      createdAt: like.user.createdAt,
      lastUpdatedAt: like.user.lastUpdatedAt,
      deletedAt: like.user.deletedAt,
    };

    const postData: PostEntity = {
      id: like.post.id,
      caption: like.post.caption,
      imageUrl: like.post.imageUrl,
      trendingScore: like.post.trendingScore,
      user: {
        id: like.post.user.id,
        fullname: like.post.user.fullname,
        pictureUrl: like.post.user.pictureUrl,
        username: like.post.user.username,
        role: like.post.user.role as "USER",
        createdAt: like.post.user.createdAt,
        lastUpdatedAt: like.post.user.lastUpdatedAt,
        deletedAt: like.post.user.deletedAt,
      },
      createdAt: like.post.createdAt,
      lastUpdatedAt: like.post.lastUpdatedAt,
      deletedAt: like.post.deletedAt,
    };

    const data: LikeEntity = {
      id: like.id,
      post: postData,
      user: userData,
      createdAt: like.createdAt,
      lastUpdatedAt: like.lastUpdatedAt,
      deletedAt: like.deletedAt,
    };

    return data;
  };

  postLike = async (data: PostLikeDTO) => {
    const like = await prisma.like.create({
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
      id: like.user.id,
      fullname: like.user.fullname,
      pictureUrl: like.user.pictureUrl,
      username: like.user.username,
      role: like.user.role as "USER",
      createdAt: like.user.createdAt,
      lastUpdatedAt: like.user.lastUpdatedAt,
      deletedAt: like.user.deletedAt,
    };

    const postData: PostEntity = {
      id: like.post.id,
      caption: like.post.caption,
      imageUrl: like.post.imageUrl,
      trendingScore: like.post.trendingScore,
      user: {
        id: like.post.user.id,
        fullname: like.post.user.fullname,
        pictureUrl: like.post.user.pictureUrl,
        username: like.post.user.username,
        role: like.post.user.role as "USER",
        createdAt: like.post.user.createdAt,
        lastUpdatedAt: like.post.user.lastUpdatedAt,
        deletedAt: like.post.user.deletedAt,
      },
      createdAt: like.post.createdAt,
      lastUpdatedAt: like.post.lastUpdatedAt,
      deletedAt: like.post.deletedAt,
    };

    const _data: LikeEntity = {
      id: like.id,

      post: postData,
      user: userData,
      createdAt: like.createdAt,
      lastUpdatedAt: like.lastUpdatedAt,
      deletedAt: like.deletedAt,
    };

    return _data;
  };

  deleteLikeById = async (id: string) => {
    const like = await prisma.like.update({
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
      id: like.user.id,
      fullname: like.user.fullname,
      pictureUrl: like.user.pictureUrl,
      username: like.user.username,
      role: like.user.role as "USER",
      createdAt: like.user.createdAt,
      lastUpdatedAt: like.user.lastUpdatedAt,
      deletedAt: like.user.deletedAt,
    };

    const postData: PostEntity = {
      id: like.post.id,
      caption: like.post.caption,
      imageUrl: like.post.imageUrl,
      trendingScore: like.post.trendingScore,
      user: {
        id: like.post.user.id,
        fullname: like.post.user.fullname,
        pictureUrl: like.post.user.pictureUrl,
        username: like.post.user.username,
        role: like.post.user.role as "USER",
        createdAt: like.post.user.createdAt,
        lastUpdatedAt: like.post.user.lastUpdatedAt,
        deletedAt: like.post.user.deletedAt,
      },
      createdAt: like.post.createdAt,
      lastUpdatedAt: like.post.lastUpdatedAt,
      deletedAt: like.post.deletedAt,
    };

    const data: LikeEntity = {
      id: like.id,

      post: postData,
      user: userData,
      createdAt: like.createdAt,
      lastUpdatedAt: like.lastUpdatedAt,
      deletedAt: like.deletedAt,
    };

    return data;
  };
}

export const likeRepo = new LikeRepo();
