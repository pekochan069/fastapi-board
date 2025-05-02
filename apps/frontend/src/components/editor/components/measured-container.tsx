import type { ComponentProps } from "solid-js";
import { createSignal, onCleanup, onMount } from "solid-js";

interface MeasuredContainerProps extends ComponentProps<"div"> {
  name: string;
}

export function MeasuredContainer(props: MeasuredContainerProps) {
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
    [`--${props.name}-width`]: `${rect().width}px`,
    [`--${props.name}-height`]: `${rect().height}px`,
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
    <div
      class="group/measured-container absolute inset-0 flex items-center justify-center"
      style={{ ...customStyle() }}
      ref={containerRef}
    >
      {props.children}
    </div>
  );
}
