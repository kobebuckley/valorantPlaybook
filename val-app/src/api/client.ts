export interface FetchResult {
  status: number;
  data: any;
  headers: Headers;
  url: string;
}

export async function client(endpoint: string, { body, ...customConfig }: RequestInit = {}): Promise<FetchResult> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };

  const config: RequestInit = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...(customConfig.headers as HeadersInit), // Type assertion for headers
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await window.fetch(endpoint, config);
    const data = await response.json();

    if (response.ok) {
      // Return a result object similar to Axios
      return {
        status: response.status,
        data,
        headers: response.headers,
        url: response.url,
      };
    }

    throw new Error(response.statusText);
  } catch (err: any) {
    const errorMessage = typeof err.message === 'string' ? err.message : 'Unknown error occurred';
    return Promise.reject(errorMessage);
  }
}

client.get = function (endpoint: string, customConfig: RequestInit = {}): Promise<FetchResult> {
  return client(endpoint, { ...customConfig, method: 'GET' });
};

client.post = function (endpoint: string, body: any, customConfig: RequestInit = {}): Promise<FetchResult> {
  return client(endpoint, { ...customConfig, body });
};
