export interface PostRepostDTO {
  postId: string;
  userId: string;
}

export interface PatchRepostDTO extends Partial<PostRepostDTO> {}
