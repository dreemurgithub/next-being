import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db';
import { getUserIdFromToken } from '@/lib/server';
import { serializePost } from './PostSerializer';

export async function GET(request: NextRequest) {
  const userId = getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ error: 'Invalid or missing access token' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
    const pageSize = 5;
    const skip = (page - 1) * pageSize;
    const titleSearch = searchParams.get('title');
    const contentSearch = searchParams.get('content');

    const where: any = {};
    if (titleSearch) {
      where.title = { contains: titleSearch, mode: 'insensitive' };
    }
    if (contentSearch) {
      where.content = { contains: contentSearch, mode: 'insensitive' };
    }

    const posts = await prisma.post.findMany({
      skip,
      take: pageSize,
      where,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        images: true,
        comments: true,
      },
    });
    // Map avatar to image for compatibility
    const mappedPosts = posts.map(post => ({
      ...post,
      author: {
        id: post.author.id,
        name: post.author.name,
        email: post.author.email,
        image: post.author.avatar
      }
    }));
    // Serialize posts to convert blobs to URLs
    const serializedPosts = await Promise.all(mappedPosts.map(serializePost));
    return NextResponse.json(serializedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Extract userId from accessToken in Authorization header
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid or missing access token' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const published = formData.get('published') === 'true';
    const images = formData.getAll('images') as File[];

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Create the post
    const post = await prisma.post.create({
      data: {
        title,
        content,
        published,
        authorId: userId,
      },
    });

    // Handle images
    if (images.length > 0) {
      const imageRecords = await Promise.all(
        images.map(async (image) => {
          const bytes = await image.arrayBuffer();
          const buffer = Buffer.from(bytes);

          return prisma.imageBlob.create({
            data: {
              filename: image.name,
              blob: buffer,
              mimeType: image.type,
              size: buffer.length,
              folder: 'posts',
              uploadedBy: userId,
              postId: post.id,
            },
          });
        })
      );

      // Update post with images (though include should handle it)
    }

    // Fetch the created post with images
    const createdPost = await prisma.post.findUnique({
      where: { id: post.id },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        images: true,
        comments: true,
      },
    });

    if (createdPost) {
      // Map avatar to image for compatibility
      const mappedCreatedPost = {
        ...createdPost,
        author: {
          id: createdPost.author.id,
          name: createdPost.author.name,
          email: createdPost.author.email,
          image: createdPost.author.avatar
        }
      };
      // Serialize the post to convert blobs to URLs
      const serializedPost = await serializePost(mappedCreatedPost);
      return NextResponse.json(serializedPost, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Failed to retrieve created post' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
