import type { JSONContent } from "@tiptap/core";
import { createSignal } from "solid-js";
import { EditorComponent, EditorProvider } from "~/components/editor";
import { Button } from "~/components/ui/button";
import { TextField, TextFieldInput, TextFieldLabel } from "~/components/ui/text-field";

export function BoardEditorForm() {
  const [title, setTitle] = createSignal("");
  const [value, setValue] = createSignal<JSONContent>();

  return (
    <form class="relative mt-8 flex flex-col gap-4">
      <TextField value={title()} onChange={setTitle}>
        <TextFieldLabel>제목</TextFieldLabel>
        <TextFieldInput />
      </TextField>
      <EditorProvider value={value()} onUpdate={setValue}>
        <EditorComponent
          output="html"
          class="h-[calc(100svh-65px-20rem)] w-full overflow-auto rounded-xl"
          editorClass="focus:outline-none px-5 py-4 h-full"
          editorContentClass="overflow-auto h-full flex-1 p-4 cursor-text"
          editable={true}
        />
      </EditorProvider>
      <div class="grid grid-cols-2 gap-2">
        <Button variant="red" class="text-background">
          취소
        </Button>
        <Button>작성</Button>
      </div>
    </form>
  );
}
