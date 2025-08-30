import { NextResponse } from 'next/server';
import { put, list} from '@vercel/blob';

export async function GET() {
  try {
    // Create a simple test blob
    const testContent = 'This is a test blob to verify Vercel Blob setup.';
    const testFile = new File([testContent], 'test.txt', { type: 'text/plain' });
    const pathname = 'test/test.txt';
    const blob = await put(pathname, testFile, { access: 'public' ,allowOverwrite: true});

    // List blobs to verify
    const { blobs } = await list({ prefix: 'test/' });

    return NextResponse.json({
      message: 'Vercel Blob setup test successful',
      uploaded: {
        pathname: blob.pathname,
        url: blob.url,
      },
      listed: blobs.map(b => ({ pathname: b.pathname, url: b.url })),
    });
  } catch (error) {
    console.error('Blob test error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Vercel Blob setup test failed', details: message },
      { status: 500 }
    );
  }
}
