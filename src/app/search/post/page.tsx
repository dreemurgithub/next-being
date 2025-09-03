'use client';

import dynamic from 'next/dynamic';

const SearchPostContent = dynamic(() => import('./SearchPostContent'), {
  ssr: false,
  loading: () => <div className="container mx-auto px-4 py-8">Loading...</div>
});

export default function SearchPostPage() {
  return <SearchPostContent />;
}
