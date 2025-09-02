"use client";

import { useSelfData } from "@/hook/useSelfData";
import PostList from "@/app/Component/Post/PostList";
import { Post } from "@/app/Component/Post/PostComponent";

export default function UserPage() {
  const { isPending, error, data, isFetching } = useSelfData();

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading user data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error loading user data: {error.message}</div>
      </div>
    );
  }

  const user = data;
  const posts: Post[] = user?.posts || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          My Profile
        </h1>

        {user && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="flex items-center space-x-4">
              {user.avatar && (
                <img
                  src={user.avatar.url}
                  alt={user.avatar.filename}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user.name || 'Anonymous'}
                </h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Posts</h2>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts found.</p>
          </div>
        ) : (
          <PostList posts={posts} />
        )}
      </div>
    </div>
  );
}
