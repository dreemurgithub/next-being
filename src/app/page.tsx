"use client";

import Image from "next/image";
import { usePost } from "@/hook/usePost";
import CreatePost from "@/app/Component/Post/create";

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

export default function Home() {
  const { isPending, error, data, isFetching, page, setpage } = usePost();

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error loading posts: {error.message}</div>
      </div>
    );
  }

  const posts: Post[] = data || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Posts Feed
        </h1>

        <CreatePost />

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Array.isArray(posts) &&  posts.map((post) => (
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
                    <span>Posted by {post.author.email}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {posts.length > 0 && (
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={() => setpage(Math.max(1, page - 1))}
              disabled={page === 1 || isFetching}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="flex items-center px-4 py-2">
              Page {page}
            </span>
            <button
              onClick={() => setpage(page + 1)}
              disabled={posts.length < 5 || isFetching}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
