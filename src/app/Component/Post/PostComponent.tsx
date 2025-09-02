'use client';
import Image from "next/image";
import { useState } from "react";
import { useComment } from "@/hook/useComment";
export interface ImageBlob {
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
  url: string;
}

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
    image: ImageBlob
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

interface PostComponentProps {
  post: Post;
}

export default function PostComponent({ post }: PostComponentProps) {
  const [commentText, setCommentText] = useState("");
  const { isPending, error, data: comments, mutation } = useComment({ postId: post.id });
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      mutation.mutate(
        { text: commentText.trim(), postId: post.id },
        {
          onSuccess: () => {
            setCommentText("");
          },
        }
      );
    }
  };

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
              <Image
                src={post.author.image.url}
                alt={post.author.image.filename}
                width={20}
                height={20}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                unoptimized // Since images are from external URLs
              />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {post.author.name || "Unknown Author"} - ahaha
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

        <div className="border-t pt-4">
          <div className="space-y-4">
            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={mutation.isPending}
              />
              <button
                type="submit"
                disabled={mutation.isPending || !commentText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? "Posting..." : "Post"}
              </button>
            </form>

            {/* Comments List */}
            {isPending ? (
              <div className="text-center py-4">
                <p className="text-gray-500">Loading comments...</p>
              </div>
            ) : error ? (
              <div className="text-center py-4">
                <p className="text-red-500">Error loading comments: {error.message}</p>
              </div>
            ) : comments && comments.length > 0 ? (
              <div className="space-y-3">
                {comments.map((comment: any) => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                        <span className="text-gray-600 font-medium text-xs">
                          {comment.author.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {comment.author.name || "Unknown"}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">No comments yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
