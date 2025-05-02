import type { Editor } from "@tiptap/core";
import type { EditorState } from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";
import type { JSX } from "solid-js";

export interface LinkProps {
  url: string;
  text?: string;
  openInNewTab?: boolean;
}

export interface ShouldShowProps {
  editor: Editor;
  view: EditorView;
  state: EditorState;
  oldState?: EditorState;
  from: number;
  to: number;
}

export interface FormatAction {
  label: string;
  icon?: JSX.Element;
  action: (editor: Editor | null) => void;
  isActive: (editor: Editor | null) => boolean;
  canExecute: (editor: Editor | null) => boolean;
  shortcuts: string[];
  value: string;
}
