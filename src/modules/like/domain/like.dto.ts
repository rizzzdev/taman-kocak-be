export interface PostLikeDTO {
  postId: string;
  userId: string;
}

export interface PatchLikeDTO extends Partial<PostLikeDTO> {}
