import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiResult } from "../types/api-types";

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: Record<string, string[]> | null,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const BASE_URI = process.env.NEXT_PUBLIC_API_BASE_URI;

// ✅ do NOT set Content-Type globally
const commonConfig: AxiosRequestConfig = {
  baseURL: BASE_URI,
  withCredentials: true,
  headers: {
    "x-is-panel": "true",
  },
};

const panelHttp: AxiosInstance = axios.create(commonConfig);
const authHttp: AxiosInstance = axios.create(commonConfig);

function toApiError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const axErr = err as AxiosError<ApiResult<unknown>>;
    const status = axErr.response?.status ?? 0;
    const data = axErr.response?.data;

    if (data) {
      return new ApiError(
        data.message || "Request failed",
        data.statusCode || status,
        data.errors ?? null,
      );
    }
    return new ApiError(axErr.message || "Request failed", status);
  }

  return new ApiError("Unknown error", 0);
}

function redirectToLogin() {
  const path = window.location.pathname;
  const seg = path.split("/")[1];
  const locale = seg && seg.length === 2 ? seg : "en";
  window.location.href = `/${locale}/login`;
}

// -------------------- refresh mutex --------------------
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  try {
    const res = await apiClient.post<unknown>("refresh", {}, true);
    return res.success === true;
  } catch {
    return false;
  }
}

async function refreshOnce(): Promise<boolean> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = (async () => {
    const ok = await refreshSession();
    isRefreshing = false;
    refreshPromise = null;
    return ok;
  })();

  return refreshPromise;
}

// -------------------- 401 interceptor --------------------
panelHttp.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    const status = error.response?.status;

    if (status === 401 && original && !original._retry) {
      original._retry = true;

      const refreshed = await refreshOnce();
      if (refreshed) return panelHttp.request(original);

      if (typeof window !== "undefined") {
        console.log("issues here");
        redirectToLogin();
      }
    }

    return Promise.reject(error);
  },
);

// -------------------- request wrappers --------------------
async function request<T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  endpoint: string,
  body?: unknown,
  params?: Record<string, unknown>,
  is_auth = false,
): Promise<ApiResult<T>> {
  const http = is_auth ? authHttp : panelHttp;
  const prefix = is_auth ? "/auth/panel" : "/v1/panel";
  const url = `${prefix}/${endpoint}`;

  try {
    const res = await http.request<ApiResult<T>>({
      method,
      url,
      params,
      data: body,
      // If you want to be explicit for JSON requests:
      headers:
        body instanceof FormData
          ? undefined
          : { "Content-Type": "application/json" },
    });

    const json = res.data;

    if (!json?.success) {
      throw new ApiError(
        json?.message || "Request failed",
        json?.statusCode || res.status,
        // (json as any)?.errors ?? null,
      );
    }

    return json;
  } catch (err) {
    throw toApiError(err);
  }
}

// ✅ Proper multipart request (Axios sets boundary)
async function requestForm<T>(
  endpoint: string,
  formData: FormData,
): Promise<ApiResult<T>> {
  const url = `/v1/panel/${endpoint}`;

  try {
    const res = await panelHttp.request<ApiResult<T>>({
      method: "POST",
      url,
      data: formData,
      // IMPORTANT: explicitly REMOVE any accidental content-type
      transformRequest: [
        (data, headers) => {
          if (headers && headers["Content-Type"])
            delete headers["Content-Type"];
          if (headers && headers["content-type"])
            delete headers["content-type"];
          return data;
        },
      ],
      headers: {
        "x-is-panel": "true",
      },
    });

    const json = res.data;

    if (!json?.success) {
      throw new ApiError(
        json?.message || "Request failed",
        json?.statusCode || res.status,
        // (json as any)?.errors ?? null,
      );
    }

    return json;
  } catch (err) {
    throw toApiError(err);
  }
}

export const apiClient = {
  get: <T>(
    endpoint: string,
    params?: Record<string, unknown>,
    is_auth = false,
  ) => request<T>("GET", endpoint, undefined, params, is_auth),

  post: <T>(endpoint: string, body: unknown, is_auth = false) =>
    request<T>("POST", endpoint, body, undefined, is_auth),

  postForm: <T>(endpoint: string, formData: FormData) =>
    requestForm<T>(endpoint, formData),
  put: <T>(endpoint: string, body: unknown, is_auth = false) =>
    request<T>("PUT", endpoint, body, undefined, is_auth),
  patch: <T>(endpoint: string, body: unknown, is_auth = false) =>
    request<T>("PATCH", endpoint, body, undefined, is_auth),
  delete: <T>(endpoint: string, is_auth = false) =>
    request<T>("DELETE", endpoint, undefined, undefined, is_auth),
};

// -------------------- FormData helper --------------------
export function toFormData(values: Record<string, unknown>) {
  const fd = new FormData();

  for (const [key, val] of Object.entries(values)) {
    if (val === undefined || val === null) continue;

    if (val instanceof File) {
      fd.append(key, val);
      continue;
    }

    if (Array.isArray(val) && val.every((x) => x instanceof File)) {
      val.forEach((f) => fd.append(`${key}[]`, f));
      continue;
    }

    fd.append(key, String(val));
  }

  return fd;
}
