export interface PostUserDTO {
  fullname: string;
  pictureUrl?: string;
  username: string;
  password: string;
}

export interface PatchUserDTO extends Partial<PostUserDTO> {
  oldPassword?: string;
}
