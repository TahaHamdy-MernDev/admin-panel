import { EgapyAnimatedLogo } from "./egapy-animated-logo";

function EmptyState() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center text-center max-w-md px-6">
 <EgapyAnimatedLogo className="w-44 mb-6 opacity-95" />
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
          No data yet
        </h2>

        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Get started by creating your first item. Everything you add will
          appear here.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            className="inline-flex items-center justify-center rounded-lg
               bg-amber-400 px-4 py-2 text-sm font-medium text-black
               hover:bg-amber-500 transition"
          >
            Create item
          </button>

          <button
            className="inline-flex items-center justify-center rounded-lg
               border border-slate-200 px-4 py-2 text-sm font-medium
               text-slate-700 hover:bg-slate-50 transition"
          >
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmptyState;
