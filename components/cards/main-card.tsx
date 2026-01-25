import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  right?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  classes?: {
    card?: string;
    header?: string;
    content?: string;
    footer?: string;
  };
  with_hover?: boolean;
};

function MainCard({
  title,
  description,
  right,
  children,
  footer,
  classes,
  with_hover = true,
}: Props) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-2xl p-5",
        "border border-border bg-card text-card-foreground",
        "shadow-none transition",
        classes?.card
      )}
    >
      {
        with_hover&& (
          <div className="pointer-events-none absolute -right-10 -top-10 h-[30%] w-[40%] rounded-full bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        )
      }

      <CardHeader className={cn("p-0", classes?.header)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          {right && (
            <span className="text-sm text-muted-foreground">{right}</span>
          )}
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent className={cn("mt-4 p-0", classes?.content)}>
        {children}
      </CardContent>

      {footer && (
        <CardFooter className={cn("mt-4 p-0", classes?.footer)}>
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

export default MainCard;
