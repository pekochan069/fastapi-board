import type { ComponentProps } from "solid-js";
import { createMemo, For, splitProps } from "solid-js";
import { cn } from "~/lib/utils";
import { getShortcutKey } from "../utils";

export interface ShortcutKeyProps extends ComponentProps<"span"> {
  keys: string[];
}

export function ShortcutKey(props: ShortcutKeyProps) {
  const [local, others] = splitProps(props, ["keys", "class"]);
  const modifiedKeys = () => props.keys.map((key) => getShortcutKey(key));
  const ariaLabel = createMemo(() =>
    modifiedKeys()
      .map((shortcut) => shortcut.readable)
      .join(" + "),
  );

  return (
    <span
      aria-label={ariaLabel()}
      class={cn("inline-flex items-center gap-0.5", local.class)}
      {...others}
    >
      <For each={modifiedKeys()}>
        {(shortcut) => (
          <kbd
            class={cn(
              "inline-block min-w-2.5 text-center align-baseline font-sans text-xs font-medium text-[rgb(156,157,160)] capitalize",

              local.class,
            )}
            {...props}
          >
            {shortcut.symbol}
          </kbd>
        )}
      </For>
    </span>
  );
}
