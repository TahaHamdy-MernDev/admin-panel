import { toast } from "sonner";
import { ApiResult } from "../types/api-types";
import { useQueryClient } from "@tanstack/react-query";

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: Record<string, string[]> | null
  ) {
    console.log(message, statusCode, errors);
    super(message);

    this.name = "ApiError";
  }
}

const BASE_URI = process.env.NEXT_PUBLIC_API_BASE_URI;

async function request<T>(
  method: string,
  endpoint: string,
  body?: unknown,
  params?: Record<string, unknown>,
  is_auth = false,
  hasRetried = false
): Promise<ApiResult<T>> {
  let url = new URL(`${BASE_URI}/v1/panel/${endpoint}`);
  if (is_auth) {
    url = new URL(`${BASE_URI}/auth/panel/${endpoint}`);
  }

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const res = await fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-is-panel": "true",
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  let json: ApiResult<T>;

  try {
    json = await res.json();
  } catch {
    throw new ApiError("Invalid response from server", res.status);
  }

  if (
    res.status === 401 &&
    !hasRetried &&
    !is_auth
  ) {
    const refreshed = await refreshSession();

    if (refreshed) {
      return request<T>(method, endpoint, body, params, is_auth, true);
    }
  }

  if (!res.ok || !json.success) {
    throw new ApiError(
      json.message || "Request failed",
      json.statusCode || res.status
    );
  }

  return json;
}
export const apiClient = {
  get: <T>(
    endpoint: string,
    params?: Record<string, unknown>,
    is_auth = false
  ) => request<T>("GET", endpoint, undefined, params, is_auth),

  post: <T>(endpoint: string, body: unknown, is_auth = false) =>
    request<T>("POST", endpoint, body, undefined, is_auth),

  put: <T>(endpoint: string, body: unknown, is_auth = false) =>
    request<T>("PUT", endpoint, body, undefined, is_auth),
  patch: <T>(endpoint: string) => request<T>("PATCH", endpoint),
  delete: <T>(endpoint: string, is_auth = false) =>
    request<T>("DELETE", endpoint, undefined, undefined, is_auth),
};

async function refreshSession(): Promise<boolean> {
  const res = await fetch(`${BASE_URI}/auth/panel/refresh`, {
    method: "POST",
    credentials: "include",
    headers: {
      "x-is-panel": "true",
    },
  });

  if (!res.ok) return false;

  const json = await res.json();
  return json?.success === true;
}
