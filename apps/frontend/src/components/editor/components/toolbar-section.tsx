import type { Editor } from "@tiptap/core";
import type { toggleVariants } from "~/components/ui/toggle";
import type { VariantProps } from "class-variance-authority";
import type { JSX } from "solid-js";
import type { FormatAction } from "../types";
import { createMemo, For, mergeProps, Show } from "solid-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { TablerChevronDown } from "~/icons/tabler/chevron-down";
import { cn } from "~/lib/utils";
import { getShortcutKey } from "../utils";
import { ShortcutKey } from "./shortcut-key";
import { ToolbarButton } from "./toolbar-button";

interface ToolbarSectionProps extends VariantProps<typeof toggleVariants> {
  editor: Editor | null;
  actions: FormatAction[];
  activeActions?: string[];
  mainActionCount?: number;
  dropdownIcon?: JSX.Element;
  dropdownTooltip?: string;
  dropdownclass?: string;
}

export function ToolbarSection(props: ToolbarSectionProps) {
  const merged = mergeProps(
    {
      activeActions: props.actions.map((action) => action.value) as string[],
      mainActionCount: 0,
      dropdownTooltip: "More options",
      dropdownClass: "w-12",
    },
    props,
  );

  const action = createMemo(() => {
    const sortedActions = merged.actions
      .filter((action) => merged.activeActions.includes(action.value))
      .sort(
        (a, b) => merged.activeActions.indexOf(a.value) - merged.activeActions.indexOf(b.value),
      );

    return {
      mainActions: sortedActions.slice(0, merged.mainActionCount),
      dropdownActions: sortedActions.slice(merged.mainActionCount),
    };
  });

  const RenderToolbarButton = (action: FormatAction) => (
    <ToolbarButton
      key={action.label}
      onClick={() => action.action(merged.editor)}
      disabled={!action.canExecute(merged.editor)}
      isActive={action.isActive(merged.editor)}
      tooltip={`${action.label} ${action.shortcuts.map((s) => getShortcutKey(s).symbol).join(" ")}`}
      aria-label={action.label}
      size={merged.size}
      variant={merged.variant}
    >
      {action.icon}
    </ToolbarButton>
  );

  const RenderDropdownMenuItem = (action: FormatAction) => (
    <DropdownMenuItem
      onClick={() => action.action(merged.editor)}
      disabled={!action.canExecute(merged.editor)}
      class={cn("flex flex-row items-center justify-between gap-4", {
        "bg-accent": action.isActive(merged.editor),
      })}
      aria-label={action.label}
    >
      <span class="grow">{action.label}</span>
      <ShortcutKey keys={action.shortcuts} />
    </DropdownMenuItem>
  );

  const isDropdownActive = () =>
    action().dropdownActions.some((action) => action.isActive(merged.editor));

  return (
    <>
      <For each={action().mainActions}>{(item) => <RenderToolbarButton {...item} />}</For>
      <Show when={action().dropdownActions.length > 0}>
        <DropdownMenu>
          <DropdownMenuTrigger
            as={ToolbarButton}
            isActive={isDropdownActive()}
            tooltip={merged.dropdownTooltip}
            aria-label={merged.dropdownTooltip}
            class={cn("gap-0", merged.dropdownClass)}
            size={merged.size}
            variant={merged.variant}
          >
            <Show when={merged.dropdownIcon} fallback={<TablerChevronDown class="size-5" />}>
              {merged.dropdownIcon}
            </Show>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-full">
            <For each={action().dropdownActions}>
              {(item) => <RenderDropdownMenuItem {...item} />}
            </For>
          </DropdownMenuContent>
        </DropdownMenu>
      </Show>
    </>
  );
}
