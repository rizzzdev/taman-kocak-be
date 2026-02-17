import { compareSync } from "bcrypt";
import {
  BadRequestError,
  NotFoundError,
} from "../../../shared/errors/index.js";
import { imageRemover } from "../../../shared/utils/image-remover.util.js";
import type { PatchUserDTO, PostUserDTO } from "../domain/user.dto.js";
import type {
  DeleteUserQuery,
  GetUserQuery,
  GetUsersQuery,
  PatchUserQuery,
  PostUserQuery,
} from "../domain/user.query.js";
import { userRepo, type IUserRepo } from "../repo/user.repo.js";

export interface IUserService extends IUserRepo {}

export class UserService implements IUserService {
  constructor(private readonly userRepo: IUserRepo) {}

  async getUsers(query?: GetUsersQuery) {
    const users = await this.userRepo.getUsers(query);
    if (users.length === 0) {
      throw new NotFoundError("No users data found!");
    }

    return users;
  }

  async getUserById(id: string, query?: GetUserQuery) {
    const user = await this.userRepo.getUserById(id, query);
    if (!user) {
      throw new NotFoundError("No user data found!");
    }

    return user;
  }

  async postUser(data: PostUserDTO, query?: PostUserQuery) {
    const isUsernameExist = await this.userRepo.getUsers({
      username: data.username,
    });
    if (isUsernameExist.length > 0) {
      throw new NotFoundError("Username already used!");
    }

    const user = await this.userRepo.postUser(data, query);

    return user;
  }

  async patchUserById(id: string, data: PatchUserDTO, query?: PatchUserQuery) {
    const isUserExist = await this.userRepo.getUserById(id, {
      includePassword: true,
    });
    if (!isUserExist) {
      throw new NotFoundError("No user data found!");
    }

    if (data.pictureUrl && isUserExist.pictureUrl) {
      imageRemover(isUserExist.pictureUrl);
    }

    if (data.username) {
    }
    const isUsernameExist =
      data.username &&
      (await this.userRepo.getUsers({
        username: data.username,
      }));
    if (
      isUsernameExist &&
      isUsernameExist?.length > 0 &&
      data.username !== isUserExist.username
    ) {
      throw new NotFoundError("Username already used!");
    }

    if (!data.oldPassword && !data.password) {
      const user = await this.userRepo.patchUserById(id, data, query);

      return user;
    }

    if (data.password && !data.oldPassword) {
      throw new BadRequestError("Old password is required!");
    }

    const isOldPasswordMatch =
      data.oldPassword &&
      data.password &&
      compareSync(data.oldPassword, isUserExist!.password!);

    if (!isOldPasswordMatch) {
      throw new BadRequestError("Old password is incorrect!");
    }

    const user = await this.userRepo.patchUserById(id, data, query);

    return user;
  }

  async deleteUserById(id: string, query?: DeleteUserQuery) {
    const isUserExist = await this.userRepo.getUserById(id, query);
    if (!isUserExist) {
      throw new NotFoundError("No user data found!");
    }

    if (isUserExist.pictureUrl) {
      imageRemover(isUserExist.pictureUrl);
    }

    const user = await this.userRepo.deleteUserById(id, query);

    return user;
  }
}

export const userService = new UserService(userRepo);
