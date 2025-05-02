import type { TooltipContentProps } from "@kobalte/core/tooltip";
import type { ComponentProps } from "solid-js";
import { Show } from "solid-js";
import { Toggle } from "~/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

interface ToolbarButtonProps extends ComponentProps<typeof Toggle> {
  isActive?: boolean;
  tooltip?: string;
  tooltipOptions?: TooltipContentProps;
}

export const ToolbarButton = (props: ToolbarButtonProps) => {
  const ToggleButton = () => (
    <Toggle className={cn({ "bg-accent": props.isActive }, props.class)} {...props}>
      {props.children}
    </Toggle>
  );

  return (
    <Show when={props.tooltip} fallback={<ToggleButton />}>
      <Tooltip>
        <TooltipTrigger as={ToggleButton} />
        <TooltipContent {...props.tooltipOptions}>
          <div class="flex flex-col items-center text-center">{props.tooltip}</div>
        </TooltipContent>
      </Tooltip>
    </Show>
  );
};

ToolbarButton.displayName = "ToolbarButton";

export default ToolbarButton;
