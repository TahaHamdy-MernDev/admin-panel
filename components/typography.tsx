import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { JSX } from "react";

const typographyStyles = cva("leading-7 mb-1.5", {
  variants: {
    as: {
      h1: "text-center text-4xl font-extrabold tracking-tight text-balance dark:text-white",
      h2: "border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-balance dark:text-white",
      h3: "text-2xl font-semibold tracking-tight text-balance dark:text-white",
      h4: "text-xl font-semibold tracking-tight text-balance dark:text-white",
      p: "text-base text-balance dark:text-white",
      blockquote: "mt-6 border-l-2 pl-6 italic text-balance dark:text-white",
      ul: "my-6 ml-6 list-disc text-balance dark:text-white",
      li: "[&>li]:mt-2 dark:text-white",
      code: "bg-muted rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-balance dark:text-white",
      lead: "text-muted-foreground text-xl dark:text-white",
      large: "text-lg font-semibold dark:text-white",
      small: "text-sm leading-none font-medium text-balance dark:text-white",
      muted: "text-muted text-sm dark:text-muted",
      page_title:
        "text-3xl font-bold text-gray-800 dark:text-gray-200 tracking-tight text-balance",
    },
  },
  defaultVariants: {
    as: "p",
  },
});

interface TypographyProps {
  as:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "p"
    | "blockquote"
    | "ul"
    | "li"
    | "code"
    | "lead"
    | "large"
    | "small"
    | "muted"
    | "page_title";
  children: React.ReactNode;
  className?: string;
}

const Text = ({ as, children, className }: TypographyProps) => {
  const componentMap: Record<string, keyof JSX.IntrinsicElements> = {
    lead: "p",
    large: "div",
    muted: "p",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    p: "p",
    blockquote: "blockquote",
    ul: "ul",
    li: "li",
    code: "code",
    small: "small",
    page_title: "h1",
  };

  const Component = componentMap[as] || "p";

  return (
    <Component className={cn(typographyStyles({ as }), className)}>
      {children}
    </Component>
  );
};

export default Text;
