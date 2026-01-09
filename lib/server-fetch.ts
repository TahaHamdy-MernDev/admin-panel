"use server";

import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_V1!;

export async function serverFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const cookieHeader = (await cookies())
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(`${API_BASE}/panel/${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  let json: any;
  try {
    json = await res.json();
  } catch {
    throw {
      message: "Invalid server response",
      statusCode: res.status,
    };
  }

  if (!res.ok || json?.success === false) {
    throw {
      message: json?.message || "Request failed",
      statusCode: res.status,
      errors: json?.errors ?? null,
    };
  }

  return json;
}
