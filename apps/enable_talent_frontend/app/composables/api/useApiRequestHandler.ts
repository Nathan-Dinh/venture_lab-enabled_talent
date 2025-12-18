/**
 * API Request Handler Composable
 *
 * This composable provides a centralized way to make HTTP requests to the backend API.
 * It wraps Nuxt's useFetch with automatic authentication, error handling, and response formatting.
 *
 * @example
 * // GET request
 * const { data, error } = await useApiRequestHandler('/api/users').get();
 *
 * // POST request with body
 * const { data, error } = await useApiRequestHandler('/api/auth/login', {
 *   body: { email: 'user@example.com', password: 'password' }
 * }).post();
 *
 * // PUT request with custom headers
 * const { data, error } = await useApiRequestHandler('/api/profile', {
 *   headers: { 'Content-Type': 'application/json' },
 *   body: { name: 'New Name' }
 * }).put();
 */

interface ApiRequestOptions<T = any> {
  headers?: Record<string, string>;
  body?: T;
}

interface ApiResponse<T = any> {
  data: T | null;
  error: Error | null;
}

interface ApiRequestMethods {
  post: <T = any>() => Promise<ApiResponse<T>>;
  get: <T = any>() => Promise<ApiResponse<T>>;
  del: <T = any>() => Promise<ApiResponse<T>>;
  put: <T = any>() => Promise<ApiResponse<T>>;
  patch: <T = any>() => Promise<ApiResponse<T>>;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Makes an HTTP request using Nuxt's useFetch
 *
 * @param method - HTTP method (GET, POST, PUT, DELETE, PATCH)
 * @param url - The API endpoint URL
 * @param options - Fetch options including headers, body, credentials, etc.
 * @returns Promise with data and error objects
 */
async function makeRequest<T = any>(
  method: HttpMethod,
  url: string,
  options: Record<string, any>
): Promise<ApiResponse<T>> {
  const { data, error } = await useFetch(url, {
    ...options,
    method,
  });

  return {
    data: (data?.value as T) || null,
    error: error?.value || null,
  };
}

/**
 * Main API request handler composable
 *
 * Provides a centralized way to make authenticated HTTP requests to the backend API.
 *
 * Features:
 * - Automatic Bearer token authentication from cookies
 * - Automatic 401 error handling (redirects to /login)
 * - Includes credentials for session management
 * - Type-safe request methods
 *
 * @param url - API endpoint path (e.g., '/api/users', '/api/auth/login')
 * @param options - Optional headers and request body
 * @returns Object with HTTP method functions (get, post, put, del, patch)
 */
export function useApiRequestHandler(
  url: string,
  options: ApiRequestOptions = {}
): ApiRequestMethods {
  const token = useCookie('token').value;
  const config = useRuntimeConfig();

  const onResponseError = ({ response }: { response: Response }) => {
    if (response.status === 401) {
      navigateTo('/login');
    }
  };

  const fetchOptions = {
    baseURL: config.public.apiBase,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      ...options.headers,
    },
    ...(options.body && { body: options.body }),
    credentials: 'include' as const,
    onResponseError,
  };

  return {
    post: <T = any>() => makeRequest<T>('POST', url, fetchOptions),
    get: <T = any>() => makeRequest<T>('GET', url, fetchOptions),
    del: <T = any>() => makeRequest<T>('DELETE', url, fetchOptions),
    put: <T = any>() => makeRequest<T>('PUT', url, fetchOptions),
    patch: <T = any>() => makeRequest<T>('PATCH', url, fetchOptions),
  };
}
