import type { Editor } from "@tiptap/core";
import type { toggleVariants } from "~/components/ui/toggle";
import type { VariantProps } from "class-variance-authority";
import type { FormatAction } from "../../types";
import { mergeProps } from "solid-js";
import { RadixIconsTextNone } from "~/icons/radix-icons/text-none";
import { TablerBold } from "~/icons/tabler/bold";
import { TablerCode } from "~/icons/tabler/code";
import { TablerDots } from "~/icons/tabler/dots";
import { TablerItalic } from "~/icons/tabler/italic";
import { TablerStrikethrough } from "~/icons/tabler/strikethrough";
import { TablerUnderline } from "~/icons/tabler/underline";
import { ToolbarSection } from "../toolbar-section";

type TextStyleAction =
  | "bold"
  | "italic"
  | "underline"
  | "strikethrough"
  | "code"
  | "clearFormatting";

interface TextStyle extends FormatAction {
  value: TextStyleAction;
}

const formatActions: TextStyle[] = [
  {
    value: "bold",
    label: "굵게",
    icon: <TablerBold class="size-5" />,
    action: (editor) => editor.chain().focus().toggleBold().run(),
    isActive: (editor) => editor.isActive("bold"),
    canExecute: (editor) =>
      editor.can().chain().focus().toggleBold().run() && !editor.isActive("codeBlock"),
    shortcuts: ["mod", "B"],
  },
  {
    value: "italic",
    label: "기울임",
    icon: <TablerItalic class="size-5" />,
    action: (editor) => editor.chain().focus().toggleItalic().run(),
    isActive: (editor) => editor.isActive("italic"),
    canExecute: (editor) =>
      editor.can().chain().focus().toggleItalic().run() && !editor.isActive("codeBlock"),
    shortcuts: ["mod", "I"],
  },
  {
    value: "underline",
    label: "밑줄",
    icon: <TablerUnderline class="size-5" />,
    action: (editor) => editor.chain().focus().toggleUnderline().run(),
    isActive: (editor) => editor.isActive("underline"),
    canExecute: (editor) =>
      editor.can().chain().focus().toggleUnderline().run() && !editor.isActive("codeBlock"),
    shortcuts: ["mod", "U"],
  },
  {
    value: "strikethrough",
    label: "취소선",
    icon: <TablerStrikethrough class="size-5" />,
    action: (editor) => editor.chain().focus().toggleStrike().run(),
    isActive: (editor) => editor.isActive("strike"),
    canExecute: (editor) =>
      editor.can().chain().focus().toggleStrike().run() && !editor.isActive("codeBlock"),
    shortcuts: ["mod", "shift", "S"],
  },
  {
    value: "code",
    label: "코드",
    icon: <TablerCode class="size-5" />,
    action: (editor) => editor.chain().focus().toggleCode().run(),
    isActive: (editor) => editor.isActive("code"),
    canExecute: (editor) =>
      editor.can().chain().focus().toggleCode().run() && !editor.isActive("codeBlock"),
    shortcuts: ["mod", "E"],
  },
  {
    value: "clearFormatting",
    label: "초기화",
    icon: <RadixIconsTextNone class="size-5" />,
    action: (editor) => editor.chain().focus().unsetAllMarks().run(),
    isActive: () => false,
    canExecute: (editor) =>
      editor.can().chain().focus().unsetAllMarks().run() && !editor.isActive("codeBlock"),
    shortcuts: ["mod", "\\"],
  },
];

interface SectionTwoProps extends VariantProps<typeof toggleVariants> {
  editor: Editor;
  activeActions?: TextStyleAction[];
  mainActionCount?: number;
}

export function SectionTwo(props: SectionTwoProps) {
  const merged = mergeProps(
    { activeActions: formatActions.map((action) => action.value), mainActionCount: 2 },
    props,
  );

  return (
    <ToolbarSection
      editor={merged.editor}
      actions={formatActions}
      activeActions={merged.activeActions}
      mainActionCount={merged.mainActionCount}
      dropdownIcon={<TablerDots class="size-5" />}
      dropdownTooltip="더 많은 옵션"
      size={merged.size}
      variant={merged.variant}
    />
  );
}
