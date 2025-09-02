import Image from "next/image";

export interface Post {
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
  images: {
    id: string;
    filename: string;
    url: string;
    size: number;
    folder: string;
    uploadedAt: Date;
  }[];
  comments: any[];
  createdAt: Date;
  updatedAt: Date;
}

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-6">
      {Array.isArray(posts) && posts.map((post) => (
        <article
          key={post.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium text-sm">
                    {post.author.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {post.author.name || "Unknown Author"}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {post.title}
            </h2>

            {post.content && (
              <p className="text-gray-700 mb-4">{post.content}</p>
            )}

            {post.images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {post.images.map((image) => (
                  <div key={image.id} className="relative">
                    <Image
                      src={image.url}
                      alt={image.filename}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg"
                      unoptimized // Since images are from external URLs
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{post.comments.length} comments</span>
              <span>Posted by {post.author.name}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
