import type { ComponentProps } from "solid-js";
import { createSignal } from "solid-js";
import { Button } from "~/components/ui/button";
import { Switch, SwitchControl, SwitchLabel, SwitchThumb } from "~/components/ui/switch";
import { TextField, TextFieldInput, TextFieldLabel } from "~/components/ui/text-field";
import { cn } from "~/lib/utils";

export interface LinkEditorProps extends ComponentProps<"div"> {
  defaultUrl?: string;
  defaultText?: string;
  defaultIsNewTab?: boolean;
  onSave: (url: string, text?: string, isNewTab?: boolean) => void;
}

export function LinkEditBlock(props: LinkEditorProps) {
  let formRef: HTMLDivElement | undefined;
  const [url, setUrl] = createSignal(props.defaultUrl || "");
  const [text, setText] = createSignal(props.defaultText || "");
  const [isNewTab, setIsNewTab] = createSignal(props.defaultIsNewTab || false);

  const onSave = (e: Event) => {
    e.preventDefault();
    const isValid = Array.from(formRef!.querySelectorAll("input")).every((input) =>
      input.checkValidity(),
    );

    if (isValid) {
      props.onSave(url(), text(), isNewTab());
    } else {
      formRef!.querySelectorAll("input").forEach((input) => {
        if (!input.checkValidity()) {
          input.reportValidity();
        }
      });
    }
  };

  return (
    <div ref={formRef}>
      <div class={cn("space-y-4", props.class)}>
        <div class="space-y-1">
          <TextField onChange={setUrl}>
            <TextFieldLabel>URL</TextFieldLabel>
            <TextFieldInput type="url" required placeholder="URL 입력" value={url()} />
          </TextField>
        </div>

        <div class="space-y-1">
          <TextField onChange={setText}>
            <TextFieldLabel>텍스트 (선택)</TextFieldLabel>
            <TextFieldInput placeholder="표기용 텍스트 입력" value={text()} />
          </TextField>
        </div>

        <div class="flex items-center space-x-2">
          <Switch checked={isNewTab()} onChange={setIsNewTab} class="flex flex-col gap-1">
            <SwitchLabel>새 탭에서 열기</SwitchLabel>
            <SwitchControl>
              <SwitchThumb />
            </SwitchControl>
          </Switch>
        </div>

        <div class="flex justify-end space-x-2">
          <Button type="button" onClick={onSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
