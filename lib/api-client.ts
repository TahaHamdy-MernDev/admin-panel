import { ApiResult } from "../types/api-types";

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: Record<string, string[]> | null
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const BASE_URI = process.env.NEXT_PUBLIC_API_BASE_URI_V1;
async function request<T>(
  method: string,
  endpoint: string,
  body?: unknown,
  params?: Record<string, unknown>
): Promise<ApiResult<T>> {
  const url = new URL(`${BASE_URI}/panel/${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const res = await fetch(url.toString(), {
    method,
    headers: { "Content-Type": "application/json", "x-is-panel": "true" },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  let json: ApiResult<T>;

  try {
    json = await res.json();
  } catch {
    throw new ApiError("Invalid response from server", res.status);
  }

  if (!res.ok || !json.success) {
    throw new ApiError(
      json.message || "Request failed",
      json.statusCode || res.status,
      json.errors
    );
  }

  return json;
}

export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, unknown>) =>
    request<T>("GET", endpoint, undefined, params),

  post: <T>(endpoint: string, body: unknown) =>
    request<T>("POST", endpoint, body),

  put: <T>(endpoint: string, body: unknown) =>
    request<T>("PUT", endpoint, body),

  delete: <T>(endpoint: string) => request<T>("DELETE", endpoint),
};
