import { API_BASE_URL } from '../constants';

type QueryValue = string | number | (string | number)[] | undefined;
type Query = Record<string, QueryValue>;

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  query?: Query;
  body?: unknown;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const isApiError = (error: unknown, status: number): boolean =>
  error instanceof ApiError && error.status === status;

const buildUrl = (path: string, query: Query = {}): string => {
  const url = new URL(path, API_BASE_URL);
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    const values = Array.isArray(value) ? value : [value];
    values.forEach((item) => {
      url.searchParams.append(key, String(item));
    });
  });
  return url.toString();
};

export async function request(path: string, options: RequestOptions = {}): Promise<Response> {
  const { method = 'GET', query, body } = options;
  const hasBody = body !== undefined;

  const response = await fetch(buildUrl(path, query), {
    method,
    headers: hasBody ? { 'Content-Type': 'application/json' } : undefined,
    body: hasBody ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new ApiError(response.status, `${method} ${path} failed with status ${response.status}`);
  }
  return response;
}

export async function requestJson<T>(path: string, options?: RequestOptions): Promise<T> {
  const response = await request(path, options);
  return (await response.json()) as T;
}

export const readTotalCount = (response: Response): number =>
  Number(response.headers.get('X-Total-Count')) || 0;
