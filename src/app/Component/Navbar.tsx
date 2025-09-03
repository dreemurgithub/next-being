'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

export default function Navbar() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    localStorage.removeItem('jwt');
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    // Always remove JWT and navigate to login
    // Invalidate the auth reset query to prevent stale data
    queryClient.invalidateQueries({ queryKey: ['/api/auth/reset'] });
    router.push('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/user" className="hover:text-gray-300">
            My Page
          </Link>

          <Link href="/search/post" className="hover:text-gray-300">
            Search Post
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
          Logout
        </button>
      </div>
    </nav>
  );
}
