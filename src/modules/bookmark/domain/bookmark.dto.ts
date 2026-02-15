export interface PostBookmarkDTO {
  postId: string;
  userId: string;
}

export interface PatchBookmarkDTO extends Partial<PostBookmarkDTO> {}
