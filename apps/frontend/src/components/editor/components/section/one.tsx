import type { Editor } from "@tiptap/core";
import type { Level } from "@tiptap/extension-heading";
import type { toggleVariants } from "~/components/ui/toggle";
import type { VariantProps } from "class-variance-authority";
import type { JSX } from "solid-js";
import type { FormatAction } from "../../types";
import { createMemo, For, mergeProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { RadixIconsLetterCaseCapitalize } from "~/icons/radix-icons/letter-case-capitalize";
import { TablerChevronDown } from "~/icons/tabler/chevron-down";
import { cn } from "~/lib/utils";
import { ShortcutKey } from "../shortcut-key";
import { ToolbarButton } from "../toolbar-button";

interface TextStyle
  extends Omit<FormatAction, "value" | "icon" | "action" | "isActive" | "canExecute"> {
  element: keyof JSX.IntrinsicElements;
  level?: Level;
  class: string;
}

const formatActions: TextStyle[] = [
  {
    label: "Normal Text",
    element: "span",
    class: "grow",
    shortcuts: ["mod", "alt", "0"],
  },
  {
    label: "Heading 1",
    element: "h1",
    level: 1,
    class: "m-0 grow text-3xl font-extrabold",
    shortcuts: ["mod", "alt", "1"],
  },
  {
    label: "Heading 2",
    element: "h2",
    level: 2,
    class: "m-0 grow text-xl font-bold",
    shortcuts: ["mod", "alt", "2"],
  },
  {
    label: "Heading 3",
    element: "h3",
    level: 3,
    class: "m-0 grow text-lg font-semibold",
    shortcuts: ["mod", "alt", "3"],
  },
  {
    label: "Heading 4",
    element: "h4",
    level: 4,
    class: "m-0 grow text-base font-semibold",
    shortcuts: ["mod", "alt", "4"],
  },
  {
    label: "Heading 5",
    element: "h5",
    level: 5,
    class: "m-0 grow text-sm font-normal",
    shortcuts: ["mod", "alt", "5"],
  },
  {
    label: "Heading 6",
    element: "h6",
    level: 6,
    class: "m-0 grow text-sm font-normal",
    shortcuts: ["mod", "alt", "6"],
  },
];

interface SectionOneProps extends VariantProps<typeof toggleVariants> {
  editor: Editor | null;
  activeLevels?: Level[];
}

export function SectionOne(props: SectionOneProps) {
  const merged = mergeProps(
    {
      activeLevels: [1, 2, 3, 4, 5, 6] as Level[],
    },
    props,
  );

  const filteredActions = createMemo(() =>
    formatActions.filter((action) => !action.level || merged.activeLevels.includes(action.level)),
  );

  const handleStyleChange = (level?: Level) => {
    if (level) {
      merged.editor?.chain().focus().toggleHeading({ level }).run();
    } else {
      merged.editor?.chain().focus().setParagraph().run();
    }
  };

  const RenderMenuItem = (itemProps: TextStyle) => (
    <DropdownMenuItem
      onClick={() => handleStyleChange(itemProps.level)}
      class={cn("flex flex-row items-center justify-between gap-4", {
        "bg-accent": itemProps.level
          ? merged.editor?.isActive("heading", { props: itemProps.level })
          : merged.editor?.isActive("paragraph"),
      })}
      aria-label={itemProps.label}
    >
      <Dynamic component={itemProps.element} class={itemProps.class}>
        {itemProps.label}
      </Dynamic>
      <ShortcutKey keys={itemProps.shortcuts} />
    </DropdownMenuItem>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        as={ToolbarButton}
        isActive={merged.editor?.isActive("heading")}
        tooltip="Text styles"
        aria-label="Text styles"
        pressed={merged.editor?.isActive("heading")}
        disabled={merged.editor?.isActive("codeBlock")}
        size={merged.size}
        variant={merged.variant}
        class="gap-0"
      >
        <RadixIconsLetterCaseCapitalize class="size-5" />
        <TablerChevronDown class="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-full">
        <For each={filteredActions()}>{(item) => <RenderMenuItem {...item} />}</For>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
