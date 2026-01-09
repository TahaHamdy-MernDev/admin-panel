import { EgapyAnimatedLogo } from "../loader/egapy-animated-logo";
import Link from "next/link";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export default function ErrorState({
  title = "Something went wrong",
  description = "We couldn’t load this data right now. Your work is safe.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="p-6 flex h-full w-full flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="w-40 opacity-80">
        <EgapyAnimatedLogo />
      </div>

      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground max-w-md">{description}</p>
      </div>

      <div className="flex gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
