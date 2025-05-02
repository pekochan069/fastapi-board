import { createSignal } from "solid-js";
import { EditorComponent, EditorProvider } from "~/components/editor";

export function BoardEditorForm() {
  return (
    <EditorProvider>
      <BoardEditorFormInner />
    </EditorProvider>
  );
}

function BoardEditorFormInner() {
  const [value, setValue] = createSignal("");
  return (
    <form class="relative">
      <EditorComponent value={value} />
    </form>
  );
}
