import "./styles/index.css";
import type { Content, Editor } from "@tiptap/core";
import type { EditorProviderProps } from "./context";
import { createEffect } from "solid-js";
import { EditorContent } from "tiptap-solid";
import { cn } from "~/lib/utils";
import { Separator } from "../ui/separator";
import { MeasuredContainer } from "./components/measured-container";
import { SectionOne } from "./components/section/one";
import { SectionTwo } from "./components/section/two";
import { useEditor } from "./context";

interface EditorComponentProps extends EditorProviderProps {
  value?: Content;
  onChange?: (value: Content) => void;
  class?: string;
  editorContentClassName?: string;
}

const Toolbar = (props: { editor: Editor | null }) => (
  <div class="flex h-12 shrink-0 overflow-x-auto border-b border-border p-2">
    <div class="flex w-max items-center gap-px">
      <SectionOne editor={props.editor} activeLevels={[1, 2, 3, 4, 5, 6]} />

      <Separator orientation="vertical" class="mx-2" />

      <SectionTwo
        editor={props.editor}
        activeActions={["bold", "italic", "underline", "strikethrough", "code", "clearFormatting"]}
        mainActionCount={3}
      />

      <Separator orientation="vertical" class="mx-2" />

      {/* <SectionThree editor={editor} /> */}

      <Separator orientation="vertical" class="mx-2" />

      {/* <SectionFour
        editor={editor}
        activeActions={["orderedList", "bulletList"]}
        mainActionCount={0}
      /> */}

      <Separator orientation="vertical" class="mx-2" />

      {/* <SectionFive
        editor={editor}
        activeActions={["codeBlock", "blockquote", "horizontalRule"]}
        mainActionCount={0}
      /> */}
    </div>
  </div>
);

export function EditorComponent(props: EditorComponentProps) {
  const editor = useEditor();

  createEffect(() => {
    console.log(editor()?.getText());
  });

  return (
    <MeasuredContainer
      name="editor"
      class={cn(
        "min-data-[orientation=vertical]:h-72 flex h-auto w-full flex-col rounded-md border border-input shadow-xs focus-within:border-primary",
        props.class,
      )}
    >
      <Toolbar editor={editor()} />
      <EditorContent
        editor={editor()}
        class={cn("minimal-tiptap-editor", props.editorContentClassName)}
      />
    </MeasuredContainer>
  );
}
