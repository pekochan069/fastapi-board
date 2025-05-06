import type { Editor } from "@tiptap/core";
import type { toggleVariants } from "~/components/ui/toggle";
import type { VariantProps } from "class-variance-authority";
import { createMemo, createSignal } from "solid-js";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { TablerLink } from "~/icons/tabler/link";
import { ToolbarButton } from "../toolbar-button";
import { LinkEditBlock } from "./link-edit-block";

interface LinkEditPopoverProps extends VariantProps<typeof toggleVariants> {
  editor: Editor;
}

export function LinkEditPopover(props: LinkEditPopoverProps) {
  const [open, setOpen] = createSignal(false);
  const selection = createMemo(() => props.editor.state.selection);
  const text = () =>
    props.editor.state.doc.textBetween(selection()?.from || 0, selection()?.to || 0, " ");

  const onSetLink = (url: string, text?: string, openInNewTab?: boolean) => {
    props.editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .insertContent({
        type: "text",
        text: text || url,
        marks: [
          {
            type: "link",
            attrs: {
              href: url,
              target: openInNewTab ? "_blank" : "",
            },
          },
        ],
      })
      .setLink({ href: url })
      .run();

    props.editor.commands.enter();
  };

  return (
    <Popover open={open()} onOpenChange={setOpen} placement="bottom-end">
      <PopoverTrigger
        as={ToolbarButton}
        isActive={props.editor.isActive("link")}
        tooltip="링크"
        aria-label="링크 추가"
        disabled={props.editor.isActive("codeBlock")}
        size={props.size}
        variant={props.variant}
        class="hover:cursor-pointer"
      >
        <TablerLink class="size-5" />
      </PopoverTrigger>
      <PopoverContent class="w-full min-w-80">
        <LinkEditBlock onSave={onSetLink} defaultText={text()} />
      </PopoverContent>
    </Popover>
  );
}
