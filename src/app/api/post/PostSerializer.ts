import { put } from '@vercel/blob';

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
    serializedPost.images = await Promise.all(
      post.images.map(async (image: ImageBlob) => {
        const { id, filename, blob, mimeType, size, folder } = image;
        const pathname = `images/${folder}/${filename}`;

        try {
          // Convert Buffer to Uint8Array for Blob
          const blobData = new Uint8Array(blob);
          // Upload the blob to Vercel Blob storage
          const uploadedBlob = await put(pathname, new Blob([blobData], { type: mimeType }), { access: 'public' });

          return {
            id,
            filename,
            url: uploadedBlob.url,
            size,
            folder,
            uploadedAt: new Date() // Use current date since put doesn't return uploadedAt
          } as SerializedImage;
        } catch (error) {
          console.error(`Failed to upload image ${filename}:`, error);
          // Return with empty url or handle error
          return {
            id,
            filename,
            url: '', // or some default
            size,
            folder,
            uploadedAt: new Date()
          } as SerializedImage;
        }
      })
    );
  }

  return serializedPost;
}
