import { prisma } from "../../../app/database/index.js";
import {
  localDateNow,
  nonDeletedDate,
} from "../../../shared/utils/date.util.js";
import type { PostEntity } from "../../post/domain/post.entity.js";
import type { UserEntity } from "../../user/domain/user.entity.js";
import type { PatchRepostDTO, PostRepostDTO } from "../domain/repost.dto.js";
import type { RepostEntity } from "../domain/repost.entity.js";
import type { GetRepostsQuery } from "../domain/repost.query.js";

export interface IRepostRepo {
  getReposts: (query?: GetRepostsQuery) => Promise<RepostEntity[]>;
  getRepostById: (id: string) => Promise<RepostEntity | null>;
  postRepost: (data: PostRepostDTO) => Promise<RepostEntity>;
  deleteRepostById: (id: string) => Promise<RepostEntity>;
}

export class RepostRepo implements IRepostRepo {
  getReposts = async (query?: GetRepostsQuery) => {
    const reposts = await prisma.repost.findMany({
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

    const RepostsMapped = reposts.map((repost) => {
      const userData: UserEntity = {
        id: repost.user.id,
        fullname: repost.user.fullname,
        pictureUrl: repost.user.pictureUrl,
        username: repost.user.username,
        role: repost.user.role as "USER",
        createdAt: repost.user.createdAt,
        lastUpdatedAt: repost.user.lastUpdatedAt,
        deletedAt: repost.user.deletedAt,
      };

      const postData: PostEntity = {
        id: repost.post.id,
        caption: repost.post.caption,
        imageUrl: repost.post.imageUrl,
        trendingScore: repost.post.trendingScore,
        user: {
          id: repost.post.user.id,
          fullname: repost.post.user.fullname,
          pictureUrl: repost.post.user.pictureUrl,
          username: repost.post.user.username,
          role: repost.post.user.role as "USER",
          createdAt: repost.post.user.createdAt,
          lastUpdatedAt: repost.post.user.lastUpdatedAt,
          deletedAt: repost.post.user.deletedAt,
        },
        createdAt: repost.post.createdAt,
        lastUpdatedAt: repost.post.lastUpdatedAt,
        deletedAt: repost.post.deletedAt,
      };

      const data: RepostEntity = {
        id: repost.id,
        post: postData,
        user: userData,
        createdAt: repost.createdAt,
        lastUpdatedAt: repost.lastUpdatedAt,
        deletedAt: repost.deletedAt,
      };

      return data;
    });

    return RepostsMapped;
  };

  getRepostById = async (id: string) => {
    const repost = await prisma.repost.findUnique({
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

    if (!repost) {
      return null;
    }

    const userData: UserEntity = {
      id: repost.user.id,
      fullname: repost.user.fullname,
      pictureUrl: repost.user.pictureUrl,
      username: repost.user.username,
      role: repost.user.role as "USER",
      createdAt: repost.user.createdAt,
      lastUpdatedAt: repost.user.lastUpdatedAt,
      deletedAt: repost.user.deletedAt,
    };

    const postData: PostEntity = {
      id: repost.post.id,
      caption: repost.post.caption,
      imageUrl: repost.post.imageUrl,
      trendingScore: repost.post.trendingScore,
      user: {
        id: repost.post.user.id,
        fullname: repost.post.user.fullname,
        pictureUrl: repost.post.user.pictureUrl,
        username: repost.post.user.username,
        role: repost.post.user.role as "USER",
        createdAt: repost.post.user.createdAt,
        lastUpdatedAt: repost.post.user.lastUpdatedAt,
        deletedAt: repost.post.user.deletedAt,
      },
      createdAt: repost.post.createdAt,
      lastUpdatedAt: repost.post.lastUpdatedAt,
      deletedAt: repost.post.deletedAt,
    };

    const data: RepostEntity = {
      id: repost.id,
      post: postData,
      user: userData,
      createdAt: repost.createdAt,
      lastUpdatedAt: repost.lastUpdatedAt,
      deletedAt: repost.deletedAt,
    };

    return data;
  };

  postRepost = async (data: PostRepostDTO) => {
    const repost = await prisma.repost.create({
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
      id: repost.user.id,
      fullname: repost.user.fullname,
      pictureUrl: repost.user.pictureUrl,
      username: repost.user.username,
      role: repost.user.role as "USER",
      createdAt: repost.user.createdAt,
      lastUpdatedAt: repost.user.lastUpdatedAt,
      deletedAt: repost.user.deletedAt,
    };

    const postData: PostEntity = {
      id: repost.post.id,
      caption: repost.post.caption,
      imageUrl: repost.post.imageUrl,
      trendingScore: repost.post.trendingScore,
      user: {
        id: repost.post.user.id,
        fullname: repost.post.user.fullname,
        pictureUrl: repost.post.user.pictureUrl,
        username: repost.post.user.username,
        role: repost.post.user.role as "USER",
        createdAt: repost.post.user.createdAt,
        lastUpdatedAt: repost.post.user.lastUpdatedAt,
        deletedAt: repost.post.user.deletedAt,
      },
      createdAt: repost.post.createdAt,
      lastUpdatedAt: repost.post.lastUpdatedAt,
      deletedAt: repost.post.deletedAt,
    };

    const _data: RepostEntity = {
      id: repost.id,

      post: postData,
      user: userData,
      createdAt: repost.createdAt,
      lastUpdatedAt: repost.lastUpdatedAt,
      deletedAt: repost.deletedAt,
    };

    return _data;
  };

  deleteRepostById = async (id: string) => {
    const repost = await prisma.repost.update({
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
      id: repost.user.id,
      fullname: repost.user.fullname,
      pictureUrl: repost.user.pictureUrl,
      username: repost.user.username,
      role: repost.user.role as "USER",
      createdAt: repost.user.createdAt,
      lastUpdatedAt: repost.user.lastUpdatedAt,
      deletedAt: repost.user.deletedAt,
    };

    const postData: PostEntity = {
      id: repost.post.id,
      caption: repost.post.caption,
      imageUrl: repost.post.imageUrl,
      trendingScore: repost.post.trendingScore,
      user: {
        id: repost.post.user.id,
        fullname: repost.post.user.fullname,
        pictureUrl: repost.post.user.pictureUrl,
        username: repost.post.user.username,
        role: repost.post.user.role as "USER",
        createdAt: repost.post.user.createdAt,
        lastUpdatedAt: repost.post.user.lastUpdatedAt,
        deletedAt: repost.post.user.deletedAt,
      },
      createdAt: repost.post.createdAt,
      lastUpdatedAt: repost.post.lastUpdatedAt,
      deletedAt: repost.post.deletedAt,
    };

    const data: RepostEntity = {
      id: repost.id,

      post: postData,
      user: userData,
      createdAt: repost.createdAt,
      lastUpdatedAt: repost.lastUpdatedAt,
      deletedAt: repost.deletedAt,
    };

    return data;
  };
}

export const repostRepo = new RepostRepo();
