export interface ApiRequestOptions<T = any> {
  headers?: Record<string, string>;
  body?: T;
}

export interface ApiResponse<T = any> {
  data: T | null;
  error: Error | null;
}

export interface ApiRequestMethods {
  post: <T = any>() => Promise<ApiResponse<T>>;
  get: <T = any>() => Promise<ApiResponse<T>>;
  del: <T = any>() => Promise<ApiResponse<T>>;
  put: <T = any>() => Promise<ApiResponse<T>>;
  patch: <T = any>() => Promise<ApiResponse<T>>;
}

export interface ApiServiceMethods {
  core: () => ApiRequestMethods;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
