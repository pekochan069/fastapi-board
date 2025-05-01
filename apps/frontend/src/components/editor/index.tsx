import StarterKit from "@tiptap/starter-kit";
import { createEditor, EditorContent } from "tiptap-solid";

export function Editor() {
  const editor = createEditor({
    extensions: [StarterKit],
  });

  return <EditorContent editor={editor()} />;
}
