import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

const isImageFile = (filename: string): boolean => {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'].includes(ext);
};

// GET: List images in the folder
export async function GET(
  request: NextRequest,
  { params }: { params: { folder: string } }
) {
  const folder = params.folder;
  const dirPath = path.join(IMAGES_DIR, folder);

  try {
    const files = await fs.readdir(dirPath);
    const images = files.filter(isImageFile);
    return NextResponse.json({ images });
  } catch (error) {
    return NextResponse.json(
      { error: 'Folder not found or access denied' },
      { status: 404 }
    );
  }
}

// POST: Upload an image to the folder
export async function POST(
  request: NextRequest,
  { params }: { params: { folder: string } }
) {
  const folder = params.folder;
  const dirPath = path.join(IMAGES_DIR, folder);

  try {
    // Create folder if it doesn't exist
    await fs.mkdir(dirPath, { recursive: true });

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

    const buffer = await file.arrayBuffer();
    const filename = file.name;
    const filePath = path.join(dirPath, filename);

    // Check if file already exists
    try {
      await fs.access(filePath);
      return NextResponse.json(
        { error: 'File already exists' },
        { status: 409 }
      );
    } catch {
      // File doesn't exist, proceed
    }

    await fs.writeFile(filePath, Buffer.from(buffer));

    return NextResponse.json({
      message: 'Image uploaded successfully',
      filename
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
  { params }: { params: { folder: string } }
) {
  const folder = params.folder;
  const dirPath = path.join(IMAGES_DIR, folder);

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

    const oldPath = path.join(dirPath, oldName);
    const newPath = path.join(dirPath, newName);

    // Check if old file exists
    try {
      await fs.access(oldPath);
    } catch {
      return NextResponse.json(
        { error: 'Original file not found' },
        { status: 404 }
      );
    }

    // Check if new file already exists
    try {
      await fs.access(newPath);
      return NextResponse.json(
        { error: 'New filename already exists' },
        { status: 409 }
      );
    } catch {
      // New file doesn't exist, proceed
    }

    await fs.rename(oldPath, newPath);

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
  { params }: { params: { folder: string } }
) {
  const folder = params.folder;
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

  const filePath = path.join(IMAGES_DIR, folder, filename);

  try {
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    await fs.unlink(filePath);

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
