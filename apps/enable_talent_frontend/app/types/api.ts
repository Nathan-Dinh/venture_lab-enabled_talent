import { HttpMethod } from '~/constants/api';

export interface FetchRequestOptions<T = any> {
  headers?: Record<string, string>;
  body?: T;
}

export interface FetchResponse<T = any> {
  data: T | null;
  error: Error | null;
}

export interface FetchMethods {
  post: <T = any>() => Promise<FetchResponse<T>>;
  get: <T = any>() => Promise<FetchResponse<T>>;
  del: <T = any>() => Promise<FetchResponse<T>>;
  put: <T = any>() => Promise<FetchResponse<T>>;
  patch: <T = any>() => Promise<FetchResponse<T>>;
}

export interface ApiServiceMethods {
  core: () => FetchMethods;
}

export type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod];
