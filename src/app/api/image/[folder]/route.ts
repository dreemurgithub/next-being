import { NextRequest, NextResponse } from 'next/server';
import { put, list, del, head } from '@vercel/blob';

const isImageFile = (filename: string): boolean => {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext ? ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff'].includes(ext) : false;
};

// GET: List images in the folder
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ folder: string }> }
) {
  const { folder } = await params;
  const prefix = `images/${folder}/`;

  try {
    const { blobs } = await list({ prefix });
    const images = blobs.map(blob => blob.pathname.split('/').pop()).filter((filename): filename is string => filename !== undefined).filter(isImageFile);
    return NextResponse.json({ images });
  } catch (error) {
    console.error('List error:', error);
    return NextResponse.json(
      { error: 'Failed to list images' },
      { status: 500 }
    );
  }
}

// POST: Upload an image to the folder
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ folder: string }> }
) {
  const { folder } = await params;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    const filename = file.name;
    const pathname = `images/${folder}/${filename}`;

    // Check if file already exists
    try {
      await head(pathname);
      return NextResponse.json(
        { error: 'File already exists' },
        { status: 409 }
      );
    } catch {
      // File doesn't exist, proceed
    }

    const blob = await put(pathname, file, { access: 'public' });

    return NextResponse.json({
      message: 'Image uploaded successfully',
      filename,
      url: blob.url
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// PUT: Rename an image in the folder
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ folder: string }> }
) {
  const { folder } = await params;

  try {
    const { oldName, newName }: { oldName: string; newName: string } =
      await request.json();

    if (!oldName || !newName) {
      return NextResponse.json(
        { error: 'oldName and newName are required' },
        { status: 400 }
      );
    }

    if (!isImageFile(oldName) || !isImageFile(newName)) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    const oldPathname = `images/${folder}/${oldName}`;
    const newPathname = `images/${folder}/${newName}`;

    // Check if old file exists
    let oldBlob;
    try {
      oldBlob = await head(oldPathname);
    } catch {
      return NextResponse.json(
        { error: 'Original file not found' },
        { status: 404 }
      );
    }

    // Check if new file already exists
    try {
      await head(newPathname);
      return NextResponse.json(
        { error: 'New filename already exists' },
        { status: 409 }
      );
    } catch {
      // New file doesn't exist, proceed
    }

    // To "rename", we need to copy the content to new pathname and delete old
    // Since Vercel Blob doesn't have copy, we download and upload
    const response = await fetch(oldBlob.url);
    const buffer = await response.arrayBuffer();
    const file = new File([buffer], newName, { type: oldBlob.contentType });

    await put(newPathname, file, { access: 'public' });
    await del(oldPathname);

    return NextResponse.json({
      message: 'Image renamed successfully',
      oldName,
      newName
    });
  } catch (error) {
    console.error('Rename error:', error);
    return NextResponse.json(
      { error: 'Failed to rename image' },
      { status: 500 }
    );
  }
}

// DELETE: Delete an image from the folder
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ folder: string }> }
) {
  const { folder } = await params;
  const url = new URL(request.url);
  const filename = url.searchParams.get('filename');

  if (!filename) {
    return NextResponse.json(
      { error: 'Filename parameter is required' },
      { status: 400 }
    );
  }

  if (!isImageFile(filename)) {
    return NextResponse.json(
      { error: 'Only image files are allowed' },
      { status: 400 }
    );
  }

  const pathname = `images/${folder}/${filename}`;

  try {
    // Check if file exists
    try {
      await head(pathname);
    } catch {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    await del(pathname);

    return NextResponse.json({
      message: 'Image deleted successfully',
      filename
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
