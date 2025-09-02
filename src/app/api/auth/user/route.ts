import { getUserIdFromToken } from "@/lib/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { serializeUser } from "../../user/UserSerializer";
import { put } from '@vercel/blob';

export async function GET(request: NextRequest) {
  const userId = getUserIdFromToken(request);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        avatar: true,
        posts: {
          include: {
            author: {
              include: { avatar: true }
            },
            images: true,
            comments: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Map avatar to image for posts' authors
    const mappedUser = {
      ...user,
      posts: user.posts.map(post => ({
        ...post,
        author: {
          id: post.author.id,
          name: post.author.name,
          email: post.author.email,
          image: post.author.avatar
        }
      }))
    };

    const serializedUser = await serializeUser(mappedUser);
    return NextResponse.json(serializedUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const userId = getUserIdFromToken(request);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const contentType = request.headers.get('content-type') || '';
    let avatarFile: File | null = null;
    let newName: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      avatarFile = formData.get('avatar') as File | null;
      const nameField = formData.get('name') as string | null;
      if (nameField) {
        newName = nameField;
      }
    } else if (contentType.includes('application/json')) {
      // Handle JSON data
      const body = await request.json();
      newName = body.name || null;
    }

    let avatarId: string | null = null;

    // Handle avatar upload
    if (avatarFile) {
      if (!avatarFile.type.startsWith('image/')) {
        return NextResponse.json({ error: "Only image files are allowed for avatar" }, { status: 400 });
      }

      const filename = `${userId}/${avatarFile.name}`;
      // const filename = `${userId}-${avatarFile.name}`;
      const pathname = `avatars/${filename}`;

      // Upload to Vercel Blob
      const blob = await put(pathname, avatarFile, { access: 'public',allowOverwrite: true });

      // Delete old avatar if exists
      if (user.avatarId) {
        try {
          await prisma.imageBlob.delete({ where: { id: user.avatarId } });
        } catch (error) {
          console.warn("Failed to delete old avatar:", error);
        }
      }

      // Save image blob to database
      const imageBlob = await prisma.imageBlob.create({
        data: {
          filename: avatarFile.name,
          blob: Buffer.from(await avatarFile.arrayBuffer()),
          mimeType: avatarFile.type,
          size: avatarFile.size,
          folder: 'avatars',
          uploadedBy: userId,
          userAvatar: {
            connect: { id: userId }
          }
        }
      });

      avatarId = imageBlob.id;
    }

    // Update user
    const updateData: { name?: string; avatarId?: string | null } = {};
    if (newName !== null) {
      updateData.name = newName;
    }
    if (avatarId !== null || avatarFile) {
      updateData.avatarId = avatarId;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        avatar: true,
        posts: {
          include: {
            author: {
              include: { avatar: true }
            },
            images: true,
            comments: true,
          },
        },
      },
    });

    // Map avatar to image for posts' authors
    const mappedUpdatedUser = {
      ...updatedUser,
      posts: updatedUser.posts.map(post => ({
        ...post,
        author: {
          id: post.author.id,
          name: post.author.name,
          email: post.author.email,
          image: post.author.avatar
        }
      }))
    };

    const serializedUser = await serializeUser(mappedUpdatedUser);
    return NextResponse.json({
      message: "User updated successfully",
      user: serializedUser
    });

  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
