'use client';

import { useEffect, useState } from 'react';

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

export default function TestPage() {
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/test-blob')
      .then(res => res.json())
      .then(setResult)
      .catch(error => setResult({ error: 'Failed to fetch', details: error.message }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Testing Vercel Blob setup...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Vercel Blob Setup Test</h1>
      {result?.error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {result.error}
          {result.details && <div className="mt-2">Details: {result.details}</div>}
        </div>
      ) : (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <strong>Success:</strong> {result?.message}
          {result?.uploaded && (
            <div className="mt-2">
              <strong>Uploaded:</strong> {result.uploaded.pathname} - <a href={result.uploaded.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View</a>
            </div>
          )}
          {result?.listed && result.listed.length > 0 && (
            <div className="mt-2">
              <strong>Listed Blobs:</strong>
              <ul className="list-disc list-inside">
                {result.listed.map((blob, index) => (
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
  );
}
