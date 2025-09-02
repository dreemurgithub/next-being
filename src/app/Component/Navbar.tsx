import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/user" className="hover:text-gray-300">
            User
          </Link>
        </div>
        <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
          Logout
        </button>
      </div>
    </nav>
  );
}
