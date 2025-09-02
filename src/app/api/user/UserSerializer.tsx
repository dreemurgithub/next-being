import { serializePost } from '../post/PostSerializer';

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

interface User {
  id: string;
  email: string;
  name: string | null;
  password?: string;
  avatarId: string | null;
  avatar: ImageBlob | null;
  posts: Post[];
  comments?: any[];
  imageBlobs?: ImageBlob[];
  createdAt: Date;
  updatedAt: Date;
}

interface SerializedUser extends Omit<User, 'password' | 'avatar' | 'posts' | 'comments' | 'imageBlobs'> {
  avatar: SerializedImage | null;
  posts: any[]; // Will be SerializedPost[]
}

export async function serializeUser(user: User): Promise<SerializedUser> {
  const serializedUser: SerializedUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarId: user.avatarId,
    avatar: null,
    posts: [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };

  // Serialize avatar if exists
  if (user.avatar) {
    const { id, filename, size, folder, createdAt } = user.avatar;
    const pathname = `${folder}/${user.id}/${filename}`;
    // const pathname = `images/${folder}/${filename}`;
    serializedUser.avatar = {
      id,
      filename,
      url: `${process.env.CDN_IMAGES}/${pathname}`,
      size,
      folder,
      uploadedAt: createdAt
    } as SerializedImage;
  }

  // Serialize posts
  if (user.posts && Array.isArray(user.posts)) {
    serializedUser.posts = await Promise.all(
      user.posts.map(async (post) => await serializePost(post))
    );
  }

  return serializedUser;
}
