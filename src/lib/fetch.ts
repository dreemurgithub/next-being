interface FetchOptions {
  headers?: Record<string, string>;
  body?: any;
}

async function apiRequest(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  options: FetchOptions = {}
): Promise<any> {
  const { headers = {}, body } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body && (method === 'POST' || method === 'PUT')) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export const fetchGet = (url: string, options?: FetchOptions): Promise<any> =>
  apiRequest(url, 'GET', options);

export const fetchPost = (url: string, options?: FetchOptions): Promise<any> =>
  apiRequest(url, 'POST', options);

export const fetchPut = (url: string, options?: FetchOptions): Promise<any> =>
  apiRequest(url, 'PUT', options);

export const fetchDel = (url: string, options?: FetchOptions): Promise<any> =>
  apiRequest(url, 'DELETE', options);
