import type { TooltipContentProps } from "@kobalte/core/tooltip";
import type { ComponentProps } from "solid-js";
import { Show, splitProps } from "solid-js";
import { Toggle } from "~/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

interface ToolbarButtonProps extends ComponentProps<typeof Toggle> {
  isActive?: boolean;
  tooltip?: string;
  tooltipOptions?: TooltipContentProps;
}

export function ToolbarButton(props: ToolbarButtonProps) {
  const [local, others] = splitProps(props, [
    "class",
    "tooltip",
    "tooltipOptions",
    "children",
    "isActive",
  ]);

  return (
    <Show when={local.tooltip} fallback={<Toggle>{local.children}</Toggle>}>
      <Tooltip openDelay={0} closeDelay={0}>
        <TooltipTrigger type="button">
          <Toggle
            data-active={local.isActive}
            class={cn("data-[active=true]:bg-accent", local.class)}
            {...others}
          >
            {local.children}
          </Toggle>
        </TooltipTrigger>
        <TooltipContent {...local.tooltipOptions}>
          <div class="flex flex-col items-center text-center">{local.tooltip}</div>
        </TooltipContent>
      </Tooltip>
    </Show>
  );
}
