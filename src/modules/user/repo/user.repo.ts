import { prisma } from "../../../app/database/index.js";
import {
  localDateNow,
  nonDeletedDate,
} from "../../../shared/utils/date.util.js";
import type { PatchUserDTO, PostUserDTO } from "../domain/user.dto.js";
import type { UserEntity } from "../domain/user.entity.js";
import type {
  DeleteUserQuery,
  GetUserQuery,
  GetUsersQuery,
  PatchUserQuery,
  PostUserQuery,
} from "../domain/user.query.js";
import bcrypt from "bcrypt";

export interface IUserRepo {
  getUsers: (query?: GetUsersQuery) => Promise<UserEntity[]>;
  getUserById: (id: string, query?: GetUserQuery) => Promise<UserEntity | null>;
  postUser: (data: PostUserDTO, query?: PostUserQuery) => Promise<UserEntity>;
  patchUserById: (
    id: string,
    data: PatchUserDTO,
    query?: PatchUserQuery,
  ) => Promise<UserEntity>;
  deleteUserById: (id: string, query?: DeleteUserQuery) => Promise<UserEntity>;
}

const getUsersRepo = async (query?: GetUsersQuery) => {
  const users = await prisma.user.findMany({
    where: {
      deletedAt: nonDeletedDate(),
      ...(query?.username && { username: query.username }),
      ...(query?.fullname && {
        fullname: {
          contains: query.fullname,
        },
      }),
    },
    take: query?.limit || 10,
    skip: query?.page ? query.page * (query.limit || 10) : 0,
    include: {
      sessions: {
        omit: {
          userId: true,
        },
      },
      bookmarks: {
        where: {
          deletedAt: nonDeletedDate(),
        },
        include: {
          post: {
            omit: {
              userId: true,
            },
          },
        },
      },
      likes: {
        where: {
          deletedAt: nonDeletedDate(),
        },
        include: {
          post: {
            omit: {
              userId: true,
            },
          },
        },
      },
      reposts: {
        where: {
          deletedAt: nonDeletedDate(),
        },
        include: {
          post: {
            omit: {
              userId: true,
            },
          },
        },
      },
      comments: {
        where: {
          deletedAt: nonDeletedDate(),
        },
        include: {
          post: {
            omit: {
              userId: true,
            },
          },
        },
      },
      posts: {
        where: {
          deletedAt: nonDeletedDate(),
        },
      },
    },
  });

  const usersMapped = users.map((user) => {
    const data: UserEntity = {
      id: user.id,
      fullname: user.fullname,
      pictureUrl: user.pictureUrl,
      username: user.username,
      ...(query?.includePassword && { password: user.password }),
      role: user.role as "USER",
      ...(query?.includeSessions && { sessions: user.sessions }),
      ...(query?.includePosts && { posts: user.posts }),
      ...(query?.includeLikes && { likes: user.likes }),
      ...(query?.includeComments && { comments: user.comments }),
      ...(query?.includeReposts && { reposts: user.reposts }),
      ...(query?.includeBookmarks && { bookmarks: user.bookmarks }),
      createdAt: user.createdAt,
      lastUpdatedAt: user.lastUpdatedAt,
      deletedAt: user.deletedAt,
    };

    return data;
  });

  return usersMapped;
};

const getUserByIdRepo = async (id: string, query?: GetUserQuery) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
      deletedAt: nonDeletedDate(),
    },
    include: {
      sessions: {
        omit: {
          userId: true,
        },
      },
      bookmarks: {
        where: {
          deletedAt: nonDeletedDate(),
        },
        include: {
          post: {
            omit: {
              userId: true,
            },
          },
        },
      },
      likes: {
        where: {
          deletedAt: nonDeletedDate(),
        },
        include: {
          post: {
            omit: {
              userId: true,
            },
          },
        },
      },
      reposts: {
        where: {
          deletedAt: nonDeletedDate(),
        },
        include: {
          post: {
            omit: {
              userId: true,
            },
          },
        },
      },
      comments: {
        where: {
          deletedAt: nonDeletedDate(),
        },
        include: {
          post: {
            omit: {
              userId: true,
            },
          },
        },
      },
      posts: {
        where: {
          deletedAt: nonDeletedDate(),
        },
      },
    },
  });
  if (!user) {
    return null;
  }

  const data: UserEntity = {
    id: user.id,
    fullname: user.fullname,
    pictureUrl: user.pictureUrl,
    username: user.username,
    ...(query?.includePassword && { password: user.password }),
    role: user.role as "USER",
    ...(query?.includeSessions && { sessions: user.sessions }),
    ...(query?.includePosts && { posts: user.posts }),
    ...(query?.includeLikes && { likes: user.likes }),
    ...(query?.includeComments && { comments: user.comments }),
    ...(query?.includeReposts && { reposts: user.reposts }),
    ...(query?.includeBookmarks && { bookmarks: user.bookmarks }),
    createdAt: user.createdAt,
    lastUpdatedAt: user.lastUpdatedAt,
    deletedAt: user.deletedAt,
  };

  return data;
};

const postUserRepo = async (data: PostUserDTO, query?: PostUserQuery) => {
  const user = await prisma.user.create({
    data: {
      fullname: data.fullname,
      pictureUrl: data.pictureUrl || null,
      username: data.username,
      password: bcrypt.hashSync(data.password, 10),
      createdAt: localDateNow(),
      deletedAt: nonDeletedDate(),
    },
  });

  const _data: UserEntity = {
    id: user.id,
    fullname: user.fullname,
    pictureUrl: user.pictureUrl,
    username: user.username,
    ...(query?.includePassword && { password: user.password }),
    role: user.role as "USER",
    ...(query?.includeSessions && { sessions: [] }),
    ...(query?.includePosts && { posts: [] }),
    ...(query?.includeLikes && { likes: [] }),
    ...(query?.includeComments && { comments: [] }),
    ...(query?.includeReposts && { reposts: [] }),
    ...(query?.includeBookmarks && { bookmarks: [] }),
    createdAt: user.createdAt,
    lastUpdatedAt: user.lastUpdatedAt,
    deletedAt: user.deletedAt,
  };

  return _data;
};

const patchUserByIdRepo = async (
  id: string,
  data: PatchUserDTO,
  query?: PatchUserQuery,
) => {
  const user = await prisma.user.update({
    where: {
      id,
      deletedAt: nonDeletedDate(),
    },
    data: {
      ...(data.fullname && { fullname: data.fullname }),
      ...(data.pictureUrl && { pictureUrl: data.pictureUrl }),
      ...(data.username && { username: data.username }),
      ...(data.password && { password: bcrypt.hashSync(data.password, 10) }),
      lastUpdatedAt: localDateNow(),
    },
    include: {
      sessions: {
        omit: {
          userId: true,
        },
      },
      bookmarks: {
        where: {
          deletedAt: nonDeletedDate(),
        },
        include: {
          post: {
            omit: {
              userId: true,
            },
          },
        },
      },
      likes: {
        where: {
          deletedAt: nonDeletedDate(),
        },
        include: {
          post: {
            omit: {
              userId: true,
            },
          },
        },
      },
      reposts: {
        where: {
          deletedAt: nonDeletedDate(),
        },
        include: {
          post: {
            omit: {
              userId: true,
            },
          },
        },
      },
      comments: {
        where: {
          deletedAt: nonDeletedDate(),
        },
        include: {
          post: {
            omit: {
              userId: true,
            },
          },
        },
      },
      posts: {
        where: {
          deletedAt: nonDeletedDate(),
        },
      },
    },
  });

  const _data: UserEntity = {
    id: user.id,
    fullname: user.fullname,
    pictureUrl: user.pictureUrl,
    username: user.username,
    ...(query?.includePassword && { password: user.password }),
    role: user.role as "USER",
    ...(query?.includeSessions && { sessions: user.sessions }),
    ...(query?.includePosts && { posts: user.posts }),
    ...(query?.includeLikes && { likes: user.likes }),
    ...(query?.includeComments && { comments: user.comments }),
    ...(query?.includeReposts && { reposts: user.reposts }),
    ...(query?.includeBookmarks && { bookmarks: user.bookmarks }),
    createdAt: user.createdAt,
    lastUpdatedAt: user.lastUpdatedAt,
    deletedAt: user.deletedAt,
  };

  return _data;
};

export const deleteUserByIdRepo = async (
  id: string,
  query?: DeleteUserQuery,
) => {
  const user = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: {
        id,
        deletedAt: nonDeletedDate(),
      },
      data: {
        deletedAt: localDateNow(),
      },
    });

    await tx.post.updateMany({
      where: {
        userId: id,
        deletedAt: nonDeletedDate(),
      },
      data: {
        deletedAt: localDateNow(),
      },
    });

    await tx.like.updateMany({
      where: {
        userId: id,
        deletedAt: nonDeletedDate(),
      },
      data: {
        deletedAt: localDateNow(),
      },
    });

    await tx.comment.updateMany({
      where: {
        userId: id,
        deletedAt: nonDeletedDate(),
      },
      data: {
        deletedAt: localDateNow(),
      },
    });

    await tx.repost.updateMany({
      where: {
        userId: id,
        deletedAt: nonDeletedDate(),
      },
      data: {
        deletedAt: localDateNow(),
      },
    });

    await tx.bookmark.updateMany({
      where: {
        userId: id,
        deletedAt: nonDeletedDate(),
      },
      data: {
        deletedAt: localDateNow(),
      },
    });

    await tx.session.updateMany({
      where: {
        userId: id,
        deletedAt: nonDeletedDate(),
      },
      data: {
        deletedAt: localDateNow(),
      },
    });

    const data: UserEntity = {
      id: user.id,
      fullname: user.fullname,
      pictureUrl: user.pictureUrl,
      username: user.username,
      ...(query?.includePassword && { password: user.password }),
      role: user.role as "USER",
      ...(query?.includeSessions && { sessions: [] }),
      ...(query?.includePosts && { posts: [] }),
      ...(query?.includeComments && { comments: [] }),
      ...(query?.includeLikes && { likes: [] }),
      ...(query?.includeReposts && { reposts: [] }),
      ...(query?.includeBookmarks && { bookmarks: [] }),
      createdAt: user.createdAt,
      lastUpdatedAt: user.lastUpdatedAt,
      deletedAt: user.deletedAt,
    };

    return data;
  });

  return user;
};

export class UserRepo implements IUserRepo {
  async getUsers(query?: GetUsersQuery) {
    return await getUsersRepo(query);
  }

  async getUserById(id: string, query?: GetUserQuery) {
    return await getUserByIdRepo(id, query);
  }

  async postUser(data: PostUserDTO, query?: PostUserQuery) {
    return await postUserRepo(data);
  }

  async patchUserById(id: string, data: PatchUserDTO, query?: PatchUserQuery) {
    return await patchUserByIdRepo(id, data, query);
  }

  async deleteUserById(id: string, query?: DeleteUserQuery) {
    return await deleteUserByIdRepo(id, query);
  }
}

export const userRepo = new UserRepo();
