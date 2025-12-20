import type {
  ApiRequestOptions,
  ApiResponse,
  ApiRequestMethods,
  ApiServiceMethods,
  HttpMethod,
} from '~/types/api';

async function executeRequest<T>(
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

function createRequestMethods(url: string, options: Record<string, any>): ApiRequestMethods {
  return {
    post: <T>() => executeRequest<T>('POST', url, options),
    get: <T>() => executeRequest<T>('GET', url, options),
    del: <T>() => executeRequest<T>('DELETE', url, options),
    put: <T>() => executeRequest<T>('PUT', url, options),
    patch: <T>() => executeRequest<T>('PATCH', url, options),
  };
}

/**
 * API request handler composable
 *
 * Provides authenticated HTTP requests to the backend API with automatic token handling.
 *
 * @param endpoint - API endpoint path (e.g., '/users', '/login')
 * @param options - Optional headers and request body
 * @returns Object with service methods (core, auth) containing HTTP method functions
 *
 * @example
 * const api = useApiRequestHandler('/users');
 * const { data, error } = await api.core().get<User[]>();
 */
export function useApiRequestHandler(
  endpoint: string,
  options: ApiRequestOptions = {}
): ApiServiceMethods {
  const baseUrl = `/backend/api${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const token = useCookie('token').value;

  const handleResponseError = ({ response }: { response: Response }) => {
    if (response.status === 401) {
      navigateTo('/login');
    }
  };

  const requestOptions = {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...(options.body && { body: options.body }),
    credentials: 'include' as const,
    onResponseError: handleResponseError,
  };

  return {
    core: () => createRequestMethods(`/core${baseUrl}`, requestOptions),
  };
}
