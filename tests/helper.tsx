import { hydrate as solidHydrate, render as solidRender } from "solid-js/web";
import { JSX } from "solid-js";

interface Options {
  hydrate?: boolean;
}

interface Result {
  element: Element,
  cleanup: () => void
}

export function render(component: () => JSX.Element, {hydrate}: Options = {}): Result {
  const container = document.body.appendChild(document.createElement("div"));

  const dispose = hydrate
    ? ((solidHydrate(component, container) as unknown) as () => void)
    : solidRender(component, container);

  return {
    element: container.firstElementChild,
    cleanup: dispose
  }
};

