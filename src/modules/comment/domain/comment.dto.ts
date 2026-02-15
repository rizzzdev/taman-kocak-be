export interface PostCommentDTO {
  text: string;
  postId: string;
  userId: string;
}

export interface PatchCommentDTO extends Partial<PostCommentDTO> {}
