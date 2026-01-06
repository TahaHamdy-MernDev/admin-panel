import { Menu } from "lucide-react";
import ChangeLocalizations from "../localization-changer";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";

export default function AppHeader() {
  const { toggleSidebar } = useSidebar();
  return (
    <header
      className="border-b border-slate-200/70 bg-white/70 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/60 sticky top-0 z-50 flex shrink-0 items-center gap-2 p-4"
      // className="bg-white dark:bg-[#111827] sticky top-0 z-50 flex shrink-0 items-center gap-2 border-b  p-4"
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <Button variant={"button_icon"} onClick={toggleSidebar}>
              <Menu />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <ChangeLocalizations />
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
