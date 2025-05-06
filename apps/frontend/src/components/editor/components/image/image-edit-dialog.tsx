import type { Editor } from "@tiptap/core";
import type { toggleVariants } from "~/components/ui/toggle";
import type { VariantProps } from "class-variance-authority";
import { createSignal } from "solid-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { RadixIconsImage } from "~/icons/radix-icons/image";
import { ToolbarButton } from "../toolbar-button";
import { ImageEditBlock } from "./image-edit-block";

interface ImageEditDialogProps extends VariantProps<typeof toggleVariants> {
  editor: Editor;
}

function ImageEditDialog(props: ImageEditDialogProps) {
  const [open, setOpen] = createSignal(false);

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger
        as={ToolbarButton}
        isActive={props.editor.isActive("image")}
        tooltip="Image"
        aria-label="Image"
        size={props.size}
        variant={props.variant}
      >
        <RadixIconsImage class="size-5" />
      </DialogTrigger>
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Select image</DialogTitle>
          <DialogDescription class="sr-only">Upload an image from your computer</DialogDescription>
        </DialogHeader>
        <ImageEditBlock editor={props.editor} close={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export { ImageEditDialog };
