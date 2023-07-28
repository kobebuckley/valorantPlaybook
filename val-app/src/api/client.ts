export interface FetchResult {
  status: number;
  data: any; // Change the type of data to 'any' or a more specific type depending on the API response
  headers: Headers;
  url: string;
}

export async function client(endpoint: string, { body, baseURL, ...customConfig }: RequestInit & { baseURL?: string } = {}): Promise<FetchResult> {
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

  // Update the base URL to the provided baseURL or the default localhost URL
  const url = baseURL ? `${baseURL}${endpoint}` : endpoint;

  try {
    const response = await window.fetch(url, config);

    if (!response.ok) {
      // If the response status is not OK, throw an error with the response status text
      throw new Error(response.statusText);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Handle non-JSON response here, if required
      throw new Error('Invalid response format: Not a JSON response');
    }

    const data = await response.json();

    // Return the data object along with other response properties
    return {
      status: response.status,
      data,
      headers: response.headers,
      url: response.url,
    };
  } catch (err: any) {
    // Catch any errors that occur during the API request and reject the Promise with an error message
    const errorMessage = typeof err.message === 'string' ? err.message : 'Unknown error occurred';
    return Promise.reject(errorMessage);
  }
}

// Helper functions for GET and POST requests
client.get = function (endpoint: string, baseURL?: string, customConfig: RequestInit = {}): Promise<FetchResult> {
  return client(endpoint, { ...customConfig, method: 'GET', baseURL });
};

client.post = function (endpoint: string, body: any, baseURL?: string, customConfig: RequestInit = {}): Promise<FetchResult> {
  return client(endpoint, { ...customConfig, body, baseURL });
};
