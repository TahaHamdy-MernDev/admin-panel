import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
const buttonVariants = cva(
  "cursor-pointer grid h-9 w-9 place-items-center rounded-full transition-all duration-200 ease-in-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4.5 shrink-0",
  {
    variants: {
      variant: {
        default: "",
        button_icon:
          "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800",

        table_icon:
          "bg-slate-100/70 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-900/70 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white",

        table_icon_edit:
          "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-900",

        table_icon_login_as:
          "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 focus:ring-emerald-400/40 dark:bg-emerald-950 dark:text-emerald-400 dark:hover:bg-emerald-900",

        table_icon_activity:
          "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 focus:ring-slate-400/40 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800",

        table_icon_danger:
          "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 focus:ring-red-400/40 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900",

        table_more:
          "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 focus:ring-slate-400/40 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
function TableButton({
  className,
  variant = "default",
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    >
      {children}
    </Comp>
  );
}

export { TableButton, buttonVariants };
