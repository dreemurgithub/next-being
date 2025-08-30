import { NextRequest, NextResponse } from 'next/server';
import { head, del } from '@vercel/blob';

const isImageFile = (filename: string): boolean => {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext ? ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff'].includes(ext) : false;
};

// GET: Retrieve image info by ID (filename)
export async function GET(
  request: NextRequest,
  { params }: { params: { folder: string; id: string } }
) {
  const folder = params.folder;
  const id = params.id;

  if (!isImageFile(id)) {
    return NextResponse.json(
      { error: 'Invalid image file' },
      { status: 400 }
    );
  }

  const pathname = `images/${folder}/${id}`;

  try {
    const blob = await head(pathname);
    return NextResponse.json({
      filename: id,
      url: blob.url,
      size: blob.size,
      uploadedAt: blob.uploadedAt
    });
  } catch (error) {
    console.error('Get image error:', error);
    return NextResponse.json(
      { error: 'Image not found' },
      { status: 404 }
    );
  }
}

// DELETE: Delete image by ID (filename)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { folder: string; id: string } }
) {
  const folder = params.folder;
  const id = params.id;

  if (!isImageFile(id)) {
    return NextResponse.json(
      { error: 'Invalid image file' },
      { status: 400 }
    );
  }

  const pathname = `images/${folder}/${id}`;

  try {
    // Check if file exists
    try {
      await head(pathname);
    } catch {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    await del(pathname);

    return NextResponse.json({
      message: 'Image deleted successfully',
      filename: id
    });
  } catch (error) {
    console.error('Delete image error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
