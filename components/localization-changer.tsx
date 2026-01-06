"use client";

import { Languages } from "lucide-react";
import { useTransition } from "react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function ChangeLocalizations() {
  const [isPending, startTransition] = useTransition();

  const locale = useLocale();

  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  const next_locale = locale === "ar" ? "en" : "ar";
  function changeLocale() {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: next_locale }
      );
    });
  }

  return (
    <Button variant={"button_icon"} onClick={changeLocale} disabled={isPending}>
      <Languages />
    </Button>
  );
}
