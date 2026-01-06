"use client";

import { Provider } from "@radix-ui/react-direction";

export function DirectionProvider({
  children,
  dir,
}: {
  children: React.ReactNode;
  dir: "rtl" | "ltr";
}) {
  return <Provider dir={dir}>{children}</Provider>;
}
