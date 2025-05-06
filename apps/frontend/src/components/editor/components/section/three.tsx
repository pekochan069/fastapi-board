import type { Editor } from "@tiptap/core";
import type { toggleVariants } from "~/components/ui/toggle";
import type { VariantProps } from "class-variance-authority";
import { createSignal, For, Show } from "solid-js";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { TablerCheck } from "~/icons/tabler/check";
import { TablerChevronDown } from "~/icons/tabler/chevron-down";

interface ColorItem {
  cssVar: string;
  label: string;
  darkLabel?: string;
}

interface ColorPalette {
  label: string;
  colors: ColorItem[];
  inverse: string;
}

const COLORS: ColorPalette[] = [
  {
    label: "Palette 1",
    inverse: "--background",
    colors: [
      { cssVar: "var(--foreground)", label: "기본" },
      { cssVar: "var(--mt-accent-bold-blue)", label: "짙은 파랑" },
      { cssVar: "var(--mt-accent-bold-teal)", label: "짙은 틸" },
      { cssVar: "var(--mt-accent-bold-green)", label: "짙은 초록" },
      { cssVar: "var(--mt-accent-bold-orange)", label: "짙은 주황" },
      { cssVar: "var(--mt-accent-bold-red)", label: "짙은 빨강" },
      { cssVar: "var(--mt-accent-bold-purple)", label: "짙은 보라" },
    ],
  },
  {
    label: "Palette 2",
    inverse: "--background",
    colors: [
      { cssVar: "var(--mt-accent-gray)", label: "회색" },
      { cssVar: "var(--mt-accent-blue)", label: "파랑" },
      { cssVar: "var(--mt-accent-teal)", label: "틸" },
      { cssVar: "var(--mt-accent-green)", label: "초록" },
      { cssVar: "var(--mt-accent-orange)", label: "주황" },
      { cssVar: "var(--mt-accent-red)", label: "빨강" },
      { cssVar: "var(--mt-accent-purple)", label: "보라" },
    ],
  },
  {
    label: "Palette 3",
    inverse: "--foreground",
    colors: [
      { cssVar: "var(--background)", label: "하양", darkLabel: "검정" },
      { cssVar: "var(--mt-accent-blue-subtler)", label: "옅은 파랑" },
      { cssVar: "var(--mt-accent-teal-subtler)", label: "옅은 틸" },
      { cssVar: "var(--mt-accent-green-subtler)", label: "옅은 초록" },
      { cssVar: "var(--mt-accent-yellow-subtler)", label: "옅은 노랑" },
      { cssVar: "var(--mt-accent-red-subtler)", label: "옅은 빨강" },
      { cssVar: "var(--mt-accent-purple-subtler)", label: "옅은 보라" },
    ],
  },
];

type ColorButtonProps = {
  color: ColorItem;
  isSelected: boolean;
  inverse: string;
  onClick: (value: string) => void;
};

function ColorButton(props: ColorButtonProps) {
  const isDarkMode = () => document.documentElement.classList.contains("dark");
  const label = () =>
    isDarkMode() && props.color.darkLabel ? props.color.darkLabel : props.color.label;

  return (
    <Tooltip>
      <TooltipTrigger
        as={ToggleGroupItem}
        tabIndex={0}
        class="relative size-7 rounded-md hover:ring-1 hover:ring-ring hover:ring-offset-2 aria-[pressed=true]:ring-2 aria-[pressed=true]:ring-primary aria-[pressed=true]:ring-offset-2 aria-[pressed=true]:outline-none"
        value={props.color.cssVar}
        aria-label={label()}
        style={{ "background-color": props.color.cssVar }}
        onClick={() => {
          props.onClick(props.color.cssVar);
        }}
      >
        <Show when={props.isSelected}>
          <TablerCheck class="absolute inset-0 m-auto size-6" style={{ color: props.inverse }} />
        </Show>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label()}</p>
      </TooltipContent>
    </Tooltip>
  );
}

type ColorPaletteProps = {
  palette: ColorPalette;
  selectedColor: string;
  inverse: string;
  onColorChange: (value: string) => void;
};

function ColorPicker(props: ColorPaletteProps) {
  return (
    <ToggleGroup
      value={props.selectedColor}
      onChange={(value: string | null) => {
        if (value) props.onColorChange(value);
      }}
      class="gap-1.5"
    >
      <For each={props.palette.colors}>
        {(color) => (
          <ColorButton
            inverse={props.inverse}
            color={color}
            isSelected={props.selectedColor === color.cssVar}
            onClick={props.onColorChange}
          />
        )}
      </For>
    </ToggleGroup>
  );
}

interface SectionThreeProps extends VariantProps<typeof toggleVariants> {
  editor: Editor;
}

export function SectionThree(props: SectionThreeProps) {
  const color = () => props.editor.getAttributes("textStyle")?.color || "hsl(var(--foreground))";
  const [selectedColor, setSelectedColor] = createSignal(color());

  const onColorChange = (value: string) => {
    setSelectedColor(value);
    props.editor.chain().setColor(value).run();
  };

  return (
    <Tooltip openDelay={0} closeDelay={0}>
      <TooltipTrigger type="button">
        <Popover placement="bottom">
          <PopoverTrigger class="inline-flex h-9 items-center justify-center rounded-md bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-5"
              style={{ color: selectedColor() }}
            >
              <path d="M4 20h16" />
              <path d="m6 16 6-12 6 12" />
              <path d="M8 12h8" />
            </svg>
            <TablerChevronDown class="size-5" />
          </PopoverTrigger>
          <PopoverContent class="w-full">
            <div class="space-y-1.5">
              <For each={COLORS}>
                {(palette) => (
                  <ColorPicker
                    palette={palette}
                    selectedColor={selectedColor()}
                    inverse={palette.inverse}
                    onColorChange={onColorChange}
                  />
                )}
              </For>
            </div>
          </PopoverContent>
        </Popover>
      </TooltipTrigger>
      <TooltipContent>글자 색상</TooltipContent>
    </Tooltip>
  );
}
