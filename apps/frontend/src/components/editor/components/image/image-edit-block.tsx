import type { Editor } from "@tiptap/core";
import { createSignal } from "solid-js";
import { Button } from "~/components/ui/button";
import { TextField, TextFieldInput, TextFieldLabel } from "~/components/ui/text-field";

interface ImageEditBlockProps {
  editor: Editor;
  close: () => void;
}

export function ImageEditBlock(props: ImageEditBlockProps) {
  let fileInputRef: HTMLInputElement | undefined;
  const [link, setLink] = createSignal("");

  const onFileChange = async (e: Event & { currentTarget: HTMLInputElement }) => {
    const files = e.currentTarget.files;
    if (!files?.length) return;

    const insertImages = async () => {
      const contentBucket = [];
      const filesArray = Array.from(files);

      for (const file of filesArray) {
        contentBucket.push({ src: file });
      }

      // props.editor.commands.setImages(contentBucket);
    };

    await insertImages();
    props.close();
  };

  const onSubmit = (e: SubmitEvent & { currentTarget: HTMLFormElement }) => {
    e.preventDefault();
    e.stopPropagation();

    if (link()) {
      // props.editor.commands.setImages([{ src: link() }]);
      props.close();
    }
  };

  return (
    <form onSubmit={onSubmit} class="space-y-6">
      <div class="space-y-1">
        <div class="flex">
          <TextField onChange={setLink}>
            <TextFieldLabel>이미지 URL</TextFieldLabel>
            <TextFieldInput
              id="image-link"
              type="url"
              required
              placeholder="https://example.com"
              value={link()}
              class="grow"
            />
          </TextField>
          <Button type="submit" class="ml-2">
            추가
          </Button>
        </div>
      </div>
      <Button type="button" class="w-full" onClick={() => fileInputRef!.click()}>
        이미지 업로드
      </Button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        multiple
        class="hidden"
        onChange={onFileChange}
      />
    </form>
  );
}
