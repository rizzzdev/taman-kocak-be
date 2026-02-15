export interface PostPostDTO {
  caption: string;
  imageUrl?: string;
  userId: string;
}

export interface PatchPostDTO extends Partial<PostPostDTO> {}
