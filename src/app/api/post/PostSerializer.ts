

interface ImageBlob {
  id: string;
  filename: string;
  blob: Uint8Array;
  mimeType: string;
  size: number;
  folder: string;
  uploadedBy: string;
  postId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface SerializedImage {
  id: string;
  filename: string;
  url: string;
  size: number;
  folder: string;
  uploadedAt: Date;
}

interface Post {
  id: string;
  title: string;
  content: string | null;
  published: boolean;
  authorId: string;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
  images: ImageBlob[];
  comments: any[];
  createdAt: Date;
  updatedAt: Date;
}

interface SerializedPost extends Omit<Post, 'images'> {
  images: SerializedImage[];
}

export async function serializePost(post: Post): Promise<SerializedPost> {
  const serializedPost: SerializedPost = {
    ...post,
    images: []
  };

  if (post.images && Array.isArray(post.images)) {
    serializedPost.images = post.images.map((image: ImageBlob) => {
      const { id, filename, size, folder, createdAt } = image;
      const pathname = `images/${folder}/${filename}`;

      return {
        id,
        filename,
        url: `${process.env.CDN_IMAGES}/${pathname}`,
        size,
        folder,
        uploadedAt: createdAt
      } as SerializedImage;
    });
  }

  return serializedPost;
}
