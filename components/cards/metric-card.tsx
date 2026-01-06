"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type Props = {
  title: string;
  value: string;
  icon?: React.ElementType<{ className?: string }>;
};

function MetricCard({ title, value, icon }: Props) {
  const t = useTranslations();
  const Icon = icon;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "border border-border bg-card text-card-foreground",
        "shadow-none transition",
        "p-4!" // use !prefix (Tailwind important) correctly
      )}
    >
  
      <div
        className={cn(
          "pointer-events-none absolute ltr:-right-10 rtl:-left-10 -top-14 h-32 w-32 rounded-full",
          "bg-primary/15 blur-3xl opacity-0 group-hover:opacity-100",
          "transition-opacity duration-300"
        )}
      />

      <CardHeader
        className={cn("flex items-center justify-between gap-2 p-0!")}
      >
        <CardTitle className="text-sm font-medium tracking-wide text-muted">
          {t(title)}
        </CardTitle>

        {Icon && (
          <div
            className={cn(
              "shrink-0 rounded-xl p-2.5",
              "border border-border bg-muted/40",
              "transition-transform duration-300 group-hover:scale-[1.02]",
              "motion-reduce:transition-none"
            )}
            aria-hidden="true"
          >
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </CardHeader>

      <CardContent className={cn("p-0!")}>
        <div className="mt-2 flex items-baseline gap-2">
          <div className="truncate text-3xl font-semibold tracking-tight">
            {value}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MetricCard;
