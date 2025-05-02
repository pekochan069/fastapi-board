import type { Editor } from "@tiptap/core";
import type { toggleVariants } from "~/components/ui/toggle";
import type { VariantProps } from "class-variance-authority";
import type { FormatAction } from "../../types";
import { mergeProps } from "solid-js";
import { RadixIconsTextNone } from "~/icons/radix-icons/text-none";
import { TablerBold } from "~/icons/tabler/bold";
import { TablerCode } from "~/icons/tabler/code";
import { TablerDotsVertical } from "~/icons/tabler/dots-vertical";
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
    label: "Bold",
    icon: <TablerBold class="size-5" />,
    action: (editor) => editor?.chain().focus().toggleBold().run(),
    isActive: (editor) => editor?.isActive("bold") || false,
    canExecute: (editor) =>
      (editor?.can().chain().focus().toggleBold().run() && !editor?.isActive("codeBlock")) || false,
    shortcuts: ["mod", "B"],
  },
  {
    value: "italic",
    label: "Italic",
    icon: <TablerItalic class="size-5" />,
    action: (editor) => editor?.chain().focus().toggleItalic().run(),
    isActive: (editor) => editor?.isActive("italic") || false,
    canExecute: (editor) =>
      (editor?.can().chain().focus().toggleItalic().run() && !editor?.isActive("codeBlock")) ||
      false,
    shortcuts: ["mod", "I"],
  },
  {
    value: "underline",
    label: "Underline",
    icon: <TablerUnderline class="size-5" />,
    action: (editor) => editor?.chain().focus().toggleUnderline().run(),
    isActive: (editor) => editor?.isActive("underline") || false,
    canExecute: (editor) =>
      (editor?.can().chain().focus().toggleUnderline().run() && !editor?.isActive("codeBlock")) ||
      false,
    shortcuts: ["mod", "U"],
  },
  {
    value: "strikethrough",
    label: "Strikethrough",
    icon: <TablerStrikethrough class="size-5" />,
    action: (editor) => editor?.chain().focus().toggleStrike().run(),
    isActive: (editor) => editor?.isActive("strike") || false,
    canExecute: (editor) =>
      (editor?.can().chain().focus().toggleStrike().run() && !editor?.isActive("codeBlock")) ||
      false,
    shortcuts: ["mod", "shift", "S"],
  },
  {
    value: "code",
    label: "Code",
    icon: <TablerCode class="size-5" />,
    action: (editor) => editor?.chain().focus().toggleCode().run(),
    isActive: (editor) => editor?.isActive("code") || false,
    canExecute: (editor) =>
      (editor?.can().chain().focus().toggleCode().run() && !editor?.isActive("codeBlock")) || false,
    shortcuts: ["mod", "E"],
  },
  {
    value: "clearFormatting",
    label: "Clear formatting",
    icon: <RadixIconsTextNone class="size-5" />,
    action: (editor) => editor?.chain().focus().unsetAllMarks().run(),
    isActive: () => false,
    canExecute: (editor) =>
      (editor?.can().chain().focus().unsetAllMarks().run() && !editor?.isActive("codeBlock")) ||
      false,
    shortcuts: ["mod", "\\"],
  },
];

interface SectionTwoProps extends VariantProps<typeof toggleVariants> {
  editor: Editor | null;
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
      dropdownIcon={<TablerDotsVertical class="size-5" />}
      dropdownTooltip="More formatting"
      dropdownclass="w-8"
      size={merged.size}
      variant={merged.variant}
    />
  );
}
