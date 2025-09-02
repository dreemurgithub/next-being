"use client";

import { Suspense } from "react";
import { usePost } from "@/hook/usePost";
import CreatePost from "@/app/Component/Post/create";
import PostList from "@/app/Component/Post/PostList";
import { Post } from "@/app/Component/Post/PostComponent";

function HomeContent() {
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
          <PostList posts={posts} />
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

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
