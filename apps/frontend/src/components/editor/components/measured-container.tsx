import type { ComponentProps } from "solid-js";
import { createSignal, onCleanup, onMount, splitProps } from "solid-js";

interface MeasuredContainerProps extends ComponentProps<"div"> {
  name: string;
}

export function MeasuredContainer(props: MeasuredContainerProps) {
  const [local, others] = splitProps(props, ["name", "class", "children"]);

  let containerRef: HTMLDivElement | undefined;

  const [observer, setObserver] = createSignal<ResizeObserver | null>(null);
  const [rect, setRect] = createSignal<DOMRect>({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    toJSON: () => "{}",
  });

  const onContainerResize = () => {
    const newRect = containerRef!.getBoundingClientRect();

    setRect((prevRect) => {
      if (
        Math.round(prevRect.width) === Math.round(newRect.width) &&
        Math.round(prevRect.height) === Math.round(newRect.height) &&
        Math.round(prevRect.x) === Math.round(newRect.x) &&
        Math.round(prevRect.y) === Math.round(newRect.y)
      ) {
        return prevRect;
      }
      return newRect;
    });
  };

  const customStyle = () => ({
    [`--${local.name}-width`]: `${rect().width}px`,
    [`--${local.name}-height`]: `${rect().height}px`,
  });

  onMount(() => {
    const resizeObserver = new ResizeObserver(() => {
      onContainerResize();
    });
    resizeObserver.observe(containerRef!);

    window.addEventListener("resize", onContainerResize);
    setObserver(resizeObserver);
    onContainerResize();
  });

  onCleanup(() => {
    observer()?.disconnect();
    window.removeEventListener("resize", onContainerResize);
  });

  return (
    <div style={{ ...customStyle() }} ref={containerRef} {...others} class={local.class}>
      {local.children}
    </div>
  );
}
