import type { Content, Editor, EditorOptions } from "@tiptap/core";
import type { Accessor, ParentProps } from "solid-js";
import { debounce } from "@solid-primitives/scheduled";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { Typography } from "@tiptap/extension-typography";
import { Underline } from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { createContext, mergeProps, useContext } from "solid-js";
import { toast } from "solid-sonner";
import { createEditor } from "tiptap-solid";
import { cn } from "~/lib/utils";
import {
  CodeBlockLowlight,
  Color,
  FileHandler,
  HorizontalRule,
  // Image,
  Link,
  ResetMarksOnEnter,
  Selection,
  UnsetAllMarks,
} from "./extensions";
import { fileToBase64, getOutput } from "./utils";

const EditorContext = createContext<Accessor<Editor | null>>();

export function useEditor() {
  const context = useContext(EditorContext);

  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }

  return context;
}

export interface EditorProviderProps extends Partial<EditorOptions> {
  editorClass?: string;
  placeholder?: string;
  output?: "json" | "html" | "text";
  value?: Content;
  throttle?: number;
  onBlur?: (content: Content) => void;
  onUpdate?: (content: Content) => void;
}

export function EditorProvider(props: ParentProps<EditorProviderProps>) {
  props = mergeProps(
    {
      output: "json" as EditorProviderProps["output"],
      placeholder: "내용을 입력하세요...",
      throttle: 200,
    },
    props,
  );

  const throttledUpdate = debounce((editor: Editor) => {
    props.onUpdate?.(getOutput(editor, props.output));
  }, props.throttle);

  const onCreate = (editor: Editor) => {
    if (props.value && editor.isEmpty) {
      editor.commands.setContent(props.value);
    }
  };

  const onBlur = (editor: Editor) => props.onBlur?.(getOutput(editor, props.output));

  const editor = createEditor({
    autofocus: true,
    content: "",
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        class: cn("focus:outline-none", props.editorClass),
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        codeBlock: false,
        paragraph: { HTMLAttributes: { class: "text-node" } },
        heading: { HTMLAttributes: { class: "heading-node" } },
        blockquote: { HTMLAttributes: { class: "block-node" } },
        bulletList: { HTMLAttributes: { class: "list-node" } },
        orderedList: { HTMLAttributes: { class: "list-node" } },
        code: { HTMLAttributes: { class: "inline", spellcheck: "false" } },
        dropcursor: { width: 2, class: "ProseMirror-dropcursor border" },
      }),
      Link,
      Underline,
      // Image.configure({
      //   allowedMimeTypes: ["image/*"],
      //   maxFileSize: 5 * 1024 * 1024,
      //   allowBase64: true,
      //   uploadFn: async (file) => {
      //     // NOTE: This is a fake upload function. Replace this with your own upload logic.
      //     // This function should return the uploaded image URL.

      //     // wait 3s to simulate upload
      //     await new Promise((resolve) => setTimeout(resolve, 3000));

      //     const src = await fileToBase64(file);

      //     // either return { id: string | number, src: string } or just src
      //     // return src;
      //     return { id: randomId(), src };
      //   },
      //   onToggle(editor, files, pos) {
      //     editor.commands.insertContentAt(
      //       pos,
      //       files.map((image) => {
      //         const blobUrl = URL.createObjectURL(image);
      //         const id = randomId();

      //         return {
      //           type: "image",
      //           attrs: {
      //             id,
      //             src: blobUrl,
      //             alt: image.name,
      //             title: image.name,
      //             fileName: image.name,
      //           },
      //         };
      //       }),
      //     );
      //   },
      //   onImageRemoved({ id, src }) {
      //     console.log("Image removed", { id, src });
      //   },
      //   onValidationError(errors) {
      //     errors.forEach((error) => {
      //       toast.error("Image validation error", {
      //         position: "bottom-right",
      //         description: error.reason,
      //       });
      //     });
      //   },
      //   onActionSuccess({ action }) {
      //     const mapping = {
      //       copyImage: "Copy Image",
      //       copyLink: "Copy Link",
      //       download: "Download",
      //     };
      //     toast.success(mapping[action], {
      //       position: "bottom-right",
      //       description: "Image action success",
      //     });
      //   },
      //   onActionError(error, { action }) {
      //     const mapping = {
      //       copyImage: "Copy Image",
      //       copyLink: "Copy Link",
      //       download: "Download",
      //     };
      //     toast.error(`Failed to ${mapping[action]}`, {
      //       position: "bottom-right",
      //       description: error.message,
      //     });
      //   },
      // }),
      FileHandler.configure({
        allowBase64: true,
        allowedMimeTypes: ["image/*"],
        maxFileSize: 5 * 1024 * 1024,
        onDrop: (editor, files, pos) => {
          files.forEach(async (file) => {
            const src = await fileToBase64(file);
            editor.commands.insertContentAt(pos, {
              type: "image",
              attrs: { src },
            });
          });
        },
        onPaste: (editor, files) => {
          files.forEach(async (file) => {
            const src = await fileToBase64(file);
            editor.commands.insertContent({
              type: "image",
              attrs: { src },
            });
          });
        },
        onValidationError: (errors) => {
          errors.forEach((error) => {
            toast.error("Image validation error", {
              position: "bottom-right",
              description: error.reason,
            });
          });
        },
      }),
      Color,
      TextStyle,
      Selection,
      Typography,
      UnsetAllMarks,
      HorizontalRule,
      ResetMarksOnEnter,
      CodeBlockLowlight,
      Placeholder.configure({ placeholder: props.placeholder }),
    ],
    onBlur: (props) => onBlur(props.editor),
    onCreate: (props) => onCreate(props.editor),
    onUpdate: (props) => throttledUpdate(props.editor),
  });

  return <EditorContext.Provider value={editor}>{props.children}</EditorContext.Provider>;
}
