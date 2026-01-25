import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "gap-2 bg-primary text-white dark:text-slate-900",
        // default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background  hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-muted",
        link: "text-primary underline-offset-4 hover:underline",
        icon: "group flex items-center gap-2 rounded-lg border px-4 py-2 bg-white dark:bg-[#0f172a] border-[#e5e7eb] dark:border-[#334155] hover:border-[#f7b23b] hover:bg-[rgba(247,178,59,0.12)] dark:hover:bg-[rgba(29,232,182,0.12)] transition-all",
        button_icon:
          "grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800",
        table_icon:
          "grid h-10 w-10 place-items-center rounded-full bg-slate-100/70 text-slate-600 transition-all duration-200 ease-in-out hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-900/70 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white",
        table_icon_danger:
          "grid h-10 w-10 place-items-center rounded-full bg-red-50 text-red-600 transition-all duration-200 hover:bg-red-100 hover:text-red-700 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900",
        table_more:
          "rounded-full grid h-10 w-10 size-10 place-items-center bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 focus:ring-slate-400/40 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
function AdminBrandSpinner({ className }: { className?: string }) {
  const gid = React.useId();
  return (
    <svg
      className={cn("h-5 w-5", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96 96"
      role="status"
      aria-label="Loading"
    >
      <defs>
        <linearGradient id={`grad-${gid}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#1de8b6" />
          <stop offset="1" stopColor="#f7b23b" />
        </linearGradient>
      </defs>

      <circle
        cx="48"
        cy="48"
        r="34"
        fill="none"
        stroke="currentColor"
        opacity="0.18"
        strokeWidth="10"
      />
      <circle
        cx="48"
        cy="48"
        r="34"
        fill="none"
        stroke={`url(#grad-${gid})`}
        strokeDasharray="110 100"
        strokeLinecap="round"
        strokeWidth="10"
      >
        <animateTransform
          attributeName="transform"
          dur="0.9s"
          from="0 48 48"
          repeatCount="indefinite"
          to="360 48 48"
          type="rotate"
        />
      </circle>

      <circle cx="48" cy="48" r="18" fill="#1de8b6" fillOpacity="0.06">
        <animate
          attributeName="r"
          dur="1.1s"
          repeatCount="indefinite"
          values="16;20;16"
        />
        <animate
          attributeName="fill-opacity"
          dur="1.1s"
          repeatCount="indefinite"
          values="0.04;0.10;0.04"
        />
      </circle>
    </svg>
  );
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children,
  is_loading = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    is_loading?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      disabled={is_loading}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {is_loading ? <AdminBrandSpinner /> : children}
      </Comp>
  );
}

export { Button, buttonVariants };
