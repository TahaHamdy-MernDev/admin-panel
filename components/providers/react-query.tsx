"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
export const globalQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  },
});
export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(globalQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
