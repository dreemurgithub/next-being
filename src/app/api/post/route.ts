import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db';
import { getUserIdFromToken } from '@/lib/server';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        images: true,
        comments: true,
      },
    });
    return NextResponse.json(posts);
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
      include: {
        author: { select: { id: true, name: true, email: true } },
        images: true,
      },
    });

    return NextResponse.json(createdPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
