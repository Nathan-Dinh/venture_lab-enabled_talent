/**
 * API Request Handler Composable
 *
 * This composable provides a centralized way to make HTTP requests to the backend API.
 * It wraps Nuxt's useFetch with automatic authentication, error handling, and response formatting.
 *
 * @example
 * // GET request
 * const { data, error } = await useApiRequestHandler('/api/users').base().get();
 *
 * // POST request with body
 * const { data, error } = await useApiRequestHandler('/api/auth/login', {
 *   body: { email: 'user@example.com', password: 'password' }
 * }).base().post();
 *
 * // PUT request with custom headers
 * const { data, error } = await useApiRequestHandler('/api/profile', {
 *   headers: { 'Content-Type': 'application/json' },
 *   body: { name: 'New Name' }
 * }).base().put();
 */

interface IApiRequestHandlerOptionArg {
  headers?: Record<string, string>;
  body?: Record<string, any>;
}

interface IFetchPayloadBody {
  baseURL?: string;
  headers: Record<string, any>;
  body?: Record<string, any>;
  credentials: 'include' | 'same-origin' | 'omit';
  onResponseError?: (error: any) => void;
}

interface IBodyRequest {
  url: string;
  fetchPayloadBody: IFetchPayloadBody;
}

interface IApiRequestMethodReturn {
  post: () => Promise<{ data: any | null; error: Error | null }>;
  get: () => Promise<{ data: any | null; error: Error | null }>;
  del: () => Promise<{ data: any | null; error: Error | null }>;
  put: () => Promise<{ data: any | null; error: Error | null }>;
  patch: () => Promise<{ data: any | null; error: Error | null }>;
}

interface IApiRequestHandlerReturn {
  base: () => IApiRequestMethodReturn;
}

/**
 * Makes an HTTP request using Nuxt's useFetch
 *
 * @param method - HTTP method (GET, POST, PUT, DELETE, PATCH)
 * @param bodyRequest - Request configuration including URL and fetch options
 * @returns Promise with data and error objects
 *
 * TODO: Add request/response logging for debugging
 * TODO: Implement retry logic for failed requests
 * TODO: Add request timeout configuration
 */
async function request(method: string, bodyRequest: IBodyRequest) {
  const { url, fetchPayloadBody } = bodyRequest;

  // Add HTTP method to the fetch configuration
  Object.assign(fetchPayloadBody, { method });

  // Execute the request using Nuxt's useFetch
  const { data, error } = await useFetch(url, fetchPayloadBody as any);

  return {
    data: data?.value || null,
    error: error?.value || null,
  };
}

// =========================
// Endpoint Factories
// =========================

/**
 * Creates an endpoint with HTTP method helpers
 *
 * @param baseURL - Base URL for the API (from runtime config)
 * @param bodyRequest - Request configuration
 * @returns Object with HTTP method functions (get, post, put, del, patch)
 */
function createEndpoint(baseURL: string, bodyRequest: IBodyRequest): IApiRequestMethodReturn {
  bodyRequest.fetchPayloadBody.baseURL = baseURL;

  return {
    post: () => request('POST', bodyRequest),
    get: () => request('GET', bodyRequest),
    del: () => request('DELETE', bodyRequest),
    put: () => request('PUT', bodyRequest),
    patch: () => request('PATCH', bodyRequest),
  };
}

// =========================
// Public Handler
// =========================

/**
 * Main API request handler composable
 *
 * How it works:
 * 1. Retrieves authentication token from cookies
 * 2. Gets backend URL from runtime config (default: http://localhost:8005)
 * 3. Constructs request headers with Bearer token authentication
 * 4. Sets up automatic error handling (401 -> redirect to /login)
 * 5. Returns methods for making HTTP requests (get, post, put, del, patch)
 *
 * Expected backend response format:
 * {
 *   success: boolean,
 *   data: any,
 *   error?: string,
 *   message?: string
 * }
 *
 * @param url - API endpoint path (e.g., '/api/users', '/api/auth/login')
 * @param options - Optional headers and request body
 * @returns Object with base() method that provides HTTP method functions
 *
 * TODO: Fix inconsistent usage pattern - should return HTTP methods directly instead of requiring .base()
 * TODO: Add request caching for GET requests
 * TODO: Implement request cancellation
 * TODO: Add loading state management
 */
export function useApiRequestHandler(
  url: string,
  options: IApiRequestHandlerOptionArg = {}
): IApiRequestHandlerReturn {
  // Get authentication token from cookies
  const token = useCookie('token').value;

  // Get runtime configuration (contains API base URL)
  const config = useRuntimeConfig();

  /**
   * Error handler for HTTP responses
   * Automatically redirects to login page on 401 Unauthorized
   *
   * TODO: Add handling for other error codes (403, 500, etc.)
   * TODO: Show user-friendly error messages
   */
  const baseOnResponseError = ({ response }: { response: Response }) => {
    if (response.status === 401) {
      // Unauthorized - clear token and redirect to login
      navigateTo('/login');
    }
  };

  // Construct the fetch payload with authentication and options
  const fetchPayloadBody: IFetchPayloadBody = {
    headers: {
      // Add Bearer token if available
      Authorization: token ? `Bearer ${token}` : undefined,
      // Merge any custom headers from options
      ...(options.headers || {}),
    },
    // Add request body if provided
    ...(options.body && { body: { ...options.body } }),
    // Include cookies in requests for session management
    credentials: 'include',
    // Set up error handler
    onResponseError: baseOnResponseError,
  };

  return {
    base: () =>
      createEndpoint(config.public.apiBase, {
        url,
        fetchPayloadBody,
      }),
  };
}
