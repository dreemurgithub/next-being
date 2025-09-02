"use client";

import { useSelfData } from "@/hook/useSelfData";
import PostList from "@/app/Component/Post/PostList";
import { Post } from "@/app/Component/Post/PostComponent";
import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPost } from "@/lib/fetch";

export default function UserPage() {
  const { isPending, error, data, isFetching } = useSelfData();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return fetchPost("/api/auth/user", { body: formData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setName("");
    },
    onError: (error) => {
      console.error("Error updating user:", error);
      alert("Failed to update profile. Please try again.");
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();

    if (selectedFile) {
      formData.append('avatar', selectedFile);
    }

    if (name.trim()) {
      formData.append('name', name.trim());
    }

    if (!selectedFile && !name.trim()) {
      alert('Please provide either a new name or select an avatar to upload');
      return;
    }

    updateUserMutation.mutate(formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
            {!isEditing ? (
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {user.avatar ? (
                      <img
                        src={user.avatar.url}
                        alt={user.avatar.filename}
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 text-2xl font-bold">
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {user.name || 'Anonymous'}
                    </h2>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500">
                      Member since {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-start space-x-6">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="relative">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-20 h-20 rounded-full object-cover border-2 border-blue-300"
                        />
                      ) : user.avatar ? (
                        <img
                          src={user.avatar.url}
                          alt={user.avatar.filename}
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600 text-2xl font-bold">
                            {(user.name || user.email).charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer underline"
                      >
                        Change Avatar
                      </label>
                      {selectedFile && (
                        <p className="text-xs text-gray-500 mt-1">
                          {selectedFile.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={user.name || "Enter your name"}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-500">
                        Member since {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateUserMutation.isPending || (!selectedFile && !name.trim())}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
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
