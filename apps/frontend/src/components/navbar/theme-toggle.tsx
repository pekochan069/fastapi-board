import { createEffect, createSignal, onMount } from "solid-js";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { TablerDeviceDesktop } from "~/icons/tabler/device-desktop";
import { TablerMoon } from "~/icons/tabler/moon";
import { TablerSun } from "~/icons/tabler/sun";

export function ThemeToggle() {
  const [theme, setTheme] = createSignal<"light" | "dark" | "system">("light");
  const [open, setOpen] = createSignal(false);

  onMount(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  });

  createEffect(() => {
    const isDark =
      theme() === "dark" ||
      (theme() === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList[isDark ? "add" : "remove"]("dark");
  });

  return (
    <DropdownMenu open={open()} onOpenChange={setOpen}>
      <DropdownMenuTrigger as={Button} variant="ghost" size="sm" class="w-9">
        <TablerSun class="size-5! scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
        <TablerMoon class="absolute size-5! scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
        <span class="sr-only">테마 변경</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => setTheme("light")}>
          <TablerSun class="mr-2" />
          <span>라이트</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setTheme("dark")}>
          <TablerMoon class="mr-2" />
          <span>다크</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setTheme("system")}>
          <TablerDeviceDesktop class="mr-2" />
          <span>시스템</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
