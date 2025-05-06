import type { Editor } from "@tiptap/core";
import type { toggleVariants } from "~/components/ui/toggle";
import type { VariantProps } from "class-variance-authority";
import type { FormatAction } from "../../types";
import { mergeProps } from "solid-js";
import { RadixIconsDividerHorizontal } from "~/icons/radix-icons/divider-horizontal";
import { TablerChevronDown } from "~/icons/tabler/chevron-down";
import { TablerCode } from "~/icons/tabler/code";
import { TablerPlus } from "~/icons/tabler/plus";
import { TablerQuoteFilled } from "~/icons/tabler/quote-filled";
import { LinkEditPopover } from "../link/link-edit-popover";
import { ToolbarSection } from "../toolbar-section";

type InsertElementAction = "codeBlock" | "blockquote" | "horizontalRule";
interface InsertElement extends FormatAction {
  value: InsertElementAction;
}

const formatActions: InsertElement[] = [
  {
    value: "codeBlock",
    label: "코드 블록",
    icon: <TablerCode class="size-5" />,
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    isActive: (editor) => editor.isActive("codeBlock") || false,
    canExecute: (editor) => editor.can().chain().focus().toggleCodeBlock().run() || false,
    shortcuts: ["mod", "alt", "C"],
  },
  {
    value: "blockquote",
    label: "인용문",
    icon: <TablerQuoteFilled class="size-5" />,
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive("blockquote") || false,
    canExecute: (editor) => editor.can().chain().focus().toggleBlockquote().run() || false,
    shortcuts: ["mod", "shift", "B"],
  },
  {
    value: "horizontalRule",
    label: "구분선",
    icon: <RadixIconsDividerHorizontal class="size-5" />,
    action: (editor) => editor.chain().focus().setHorizontalRule().run(),
    isActive: () => false,
    canExecute: (editor) => editor.can().chain().focus().setHorizontalRule().run() || false,
    shortcuts: ["mod", "alt", "-"],
  },
];

interface SectionFiveProps extends VariantProps<typeof toggleVariants> {
  editor: Editor;
  activeActions?: InsertElementAction[];
  mainActionCount?: number;
}

export function SectionFive(props: SectionFiveProps) {
  const merged = mergeProps(
    {
      activeActions: formatActions.map((action) => action.value),
      mainActionCount: 0,
    },
    props,
  );
  return (
    <>
      <LinkEditPopover editor={merged.editor} size={merged.size} variant={merged.variant} />
      {/* <ImageEditDialog editor={merged.editor} size={merged.size} variant={merged.variant} /> */}
      <ToolbarSection
        editor={merged.editor}
        actions={formatActions}
        activeActions={merged.activeActions}
        mainActionCount={merged.mainActionCount}
        dropdownIcon={
          <>
            <TablerPlus class="size-5" />
            <TablerChevronDown class="size-5" />
          </>
        }
        dropdownTooltip="요소 삽입"
        size={merged.size}
        variant={merged.variant}
      />
    </>
  );
}
