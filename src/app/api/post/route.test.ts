/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { GET } from './route';
import prisma from '@/lib/db';
import { serializePost } from './PostSerializer';

// Mock the dependencies
jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: {
    post: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock('./PostSerializer', () => ({
  serializePost: jest.fn(),
}));

// Mock the JWT verification
jest.mock('@/lib/server', () => ({
  getUserIdFromToken: jest.fn(),
}));

// Mock NextResponse
jest.mock('next/server', () => ({
  ...jest.requireActual('next/server'),
  NextResponse: {
    json: jest.fn((data, options = {}) => ({
      json: () => Promise.resolve(data),
      status: options.status || 200,
      ...options,
    })),
  },
}));

describe('POST /api/post', () => {
  const createMockRequest = (url = 'http://localhost:3000/api/post?page=1', headers = {}) => {
    const mockRequest = new NextRequest(url, { headers });
    // Mock the URL searchParams
    const urlObj = new URL(url);
    Object.defineProperty(mockRequest, 'url', { value: url, writable: true });
    Object.defineProperty(mockRequest, 'nextUrl', { value: urlObj, writable: true });
    return mockRequest;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('GET', () => {
    it('should fetch posts with page=1 and return post records', async () => {
      // Mock user authentication
      const { getUserIdFromToken } = require('@/lib/server');
      getUserIdFromToken.mockReturnValue(1);

      // Mock database response
      const mockPosts = [
        {
          id: 1,
          title: 'Test Post 1',
          content: 'Test content 1',
          published: true,
          authorId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          author: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            avatar: 'avatar-url',
          },
          images: [],
          comments: [],
        },
        {
          id: 2,
          title: 'Test Post 2',
          content: 'Test content 2',
          published: true,
          authorId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          author: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            avatar: 'avatar-url',
          },
          images: [],
          comments: [],
        },
      ];

      (prisma.post.findMany as jest.Mock).mockResolvedValue(mockPosts);
      
      // Mock the serializePost function
      (serializePost as jest.Mock).mockImplementation((post) => Promise.resolve(post));

      const request = createMockRequest('http://localhost:3000/api/post?page=1');
      const response = await GET(request);
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBe(2);
      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 5,
          orderBy: { createdAt: 'desc' },
        })
      );
    });

    it('should handle unauthorized access', async () => {
      // Mock user authentication to return null (unauthorized)
      const { getUserIdFromToken } = require('@/lib/server');
      getUserIdFromToken.mockReturnValue(null);

      const request = createMockRequest('http://localhost:3000/api/post?page=1');
      const response = await GET(request);
      const responseBody = await response.json();

      expect(response.status).toBe(401);
      expect(responseBody).toEqual({ error: 'Invalid or missing access token' });
    });

    it('should handle database errors', async () => {
      // Mock user authentication
      const { getUserIdFromToken } = require('@/lib/server');
      getUserIdFromToken.mockReturnValue(1);

      // Mock database error
      (prisma.post.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      const request = createMockRequest('http://localhost:3000/api/post?page=1');
      const response = await GET(request);
      const responseBody = await response.json();

      expect(response.status).toBe(500);
      expect(responseBody).toEqual({ error: 'Failed to fetch posts' });
    });
  });
});
