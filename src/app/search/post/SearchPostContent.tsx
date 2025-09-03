'use client';

import { useState } from 'react';
import PostList from '@/app/Component/Post/PostList';
import { Post } from '@/app/Component/Post/PostComponent';
import { usePostSearch } from '@/hook/usePostSearch';

export default function SearchPostPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [minComments, setMinComments] = useState<number | ''>('');
  const [maxComments, setMaxComments] = useState<number | ''>('');

  const { isPending, error, data } = usePostSearch({
    title: searchQuery || undefined,
    minComments: minComments || undefined,
    maxComments: maxComments || undefined,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Search Posts</h1>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search Bar */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Posts
            </label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, content, or author..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Min Comments Filter */}
          <div>
            <label htmlFor="minComments" className="block text-sm font-medium text-gray-700 mb-2">
              Min Comments
            </label>
            <input
              type="number"
              id="minComments"
              value={minComments}
              onChange={(e) => setMinComments(e.target.value ? parseInt(e.target.value) : '')}
              placeholder="0"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Max Comments Filter */}
          <div>
            <label htmlFor="maxComments" className="block text-sm font-medium text-gray-700 mb-2">
              Max Comments
            </label>
            <input
              type="number"
              id="maxComments"
              value={maxComments}
              onChange={(e) => setMaxComments(e.target.value ? parseInt(e.target.value) : '')}
              placeholder="No limit"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Apply Filters Button */}
          <div className="md:col-span-2 flex items-end">
            <button
              type="button"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Results</h2>
        {isPending && <div className="text-center py-8">Loading posts...</div>}
        {error && <div className="text-center py-8 text-red-600">Error loading posts: {error.message}</div>}
        {!isPending && !error && (
          <PostList posts={data || []} />
        )}
      </div>
    </div>
  );
}
