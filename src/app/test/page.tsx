'use client';

import React, { useEffect, useState } from 'react';

interface TestResult {
  message?: string;
  error?: string;
  details?: string;
  uploaded?: {
    pathname: string;
    url: string;
  };
  listed?: Array<{
    pathname: string;
    url: string;
  }>;
}

interface DBTestResult {
  message?: string;
  error?: string;
  data?: any;
  details?: string;
}

export default function TestPage() {
  const [blobResult, setBlobResult] = useState<TestResult | null>(null);
  const [dbResult, setDbResult] = useState<DBTestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        // Fetch blob test
        const blobRes = await fetch('/api/test-blob');
        const blobData = await blobRes.json();
        setBlobResult(blobData);

        // Fetch DB test
        const dbRes = await fetch('/api/test-db');
        const dbData = await dbRes.json();
        setDbResult(dbData);
      } catch (error) {
        setBlobResult({ error: 'Failed to fetch', details: error instanceof Error ? error.message : 'Unknown error' });
        setDbResult({ error: 'Failed to fetch', details: error instanceof Error ? error.message : 'Unknown error' });
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Testing Vercel Blob and Database setup...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Setup Tests</h1>

      {/* Vercel Blob Test */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Vercel Blob Test</h2>
        {blobResult?.error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {blobResult.error}
            {blobResult.details && <div className="mt-2">Details: {blobResult.details}</div>}
          </div>
        ) : (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <strong>Success:</strong> {blobResult?.message}
            {blobResult?.uploaded && (
              <div className="mt-2">
                <strong>Uploaded:</strong> {blobResult.uploaded.pathname} - <a href={blobResult.uploaded.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View</a>
              </div>
            )}
            {blobResult?.listed && blobResult.listed.length > 0 && (
              <div className="mt-2">
                <strong>Listed Blobs:</strong>
                <ul className="list-disc list-inside">
                  {blobResult.listed.map((blob: { pathname: string; url: string }, index: number) => (
                    <li key={index}>
                      {blob.pathname} - <a href={blob.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Database Test */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Database Test</h2>
        {dbResult?.error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {dbResult.error}
            {dbResult.details && <div className="mt-2">Details: {dbResult.details}</div>}
          </div>
        ) : (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <strong>Success:</strong> {dbResult?.message}
            {dbResult?.data && (
              <div className="mt-2">
                <strong>Data:</strong> {JSON.stringify(dbResult.data)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
