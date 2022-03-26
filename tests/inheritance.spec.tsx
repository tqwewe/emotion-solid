import { hydrate as solidHydrate, render as solidRender } from "solid-js/web";
import { JSX, createSignal } from "solid-js";
import { styled } from "../src/index";

interface Options {
  hydrate?: boolean;
}

interface Result {
  element: Element,
  cleanup: () => void
}

function render(component: () => JSX.Element, {hydrate}: Options = {}): Result {
  const container = document.body.appendChild(document.createElement("div"));

  const dispose = hydrate
    ? ((solidHydrate(component, container) as unknown) as () => void)
    : solidRender(component, container);

  return {
    element: container.firstElementChild,
    cleanup: dispose
  }
};

const Component = styled('div')({
  backgroundColor: 'white',
});

const InterpolatingComponent = styled('div')(({value}) => ({
  backgroundColor: value ? 'red' : 'blue',
}));

describe('styled', () => {
  it('works with single style property', () => {
    const {element} = render(() => <Component />, {});
    expect(window.getComputedStyle(element)['background-color']).toEqual('white');
  });

  it('works with interpolated style property', () => {
    const {element} = render(() => <InterpolatingComponent value={true} />, {});
    expect(window.getComputedStyle(element)['background-color']).toEqual('red');
  });

  it('works with interpolated style property modified with signal', () => {
    const [value, setValue] = createSignal(false);
    const {element} = render(() => <InterpolatingComponent value={value()} />, {});
    setValue(true);
    expect(window.getComputedStyle(element)['background-color']).toEqual('red');
  });

  it('does not do unnecessary rerenders of children', () => {
    const child = jest.fn();
    child.mockReturnValue('Hello world text!')
    const {element} = render(() => <Component>{child}</Component>, {});
    expect(child.mock.calls.length).toBe(1); // Called exactly once
  });

  describe('extending', () => {
    it('works without props', () => {
      const ExtendingComponent = styled(Component)({
        backgroundColor: 'blue',
      });
      const {element} = render(() => <ExtendingComponent />, {});
      expect(window.getComputedStyle(element)['background-color']).toEqual('blue');
    });

    it('works with one prop to parent', () => {
      const ExtendingComponent = styled(Component)(({value}) => ({
        backgroundColor: value ? 'blue' : 'yellow',
      }));
      const {element} = render(() => <ExtendingComponent value={true} />, {});
      expect(window.getComputedStyle(element)['background-color']).toEqual('blue');
    });

    it('works with forwarding props', () => {
      const BaseComponent = styled('div')(({value}) => ({
        backgroundColor: value ? 'blue' : 'yellow',
      }));
      const ExtendingComponent = styled(BaseComponent)({
        color: 'yellow',
      });
      const {element} = render(() => <ExtendingComponent value={true} />, {});
      expect(window.getComputedStyle(element)['background-color']).toEqual('blue');
    });

    it('does not do unnecessary rerenders of children', () => {
      const ExtendingComponent = styled(Component)({
        backgroundColor: 'blue',
      });
      const child = jest.fn();
      child.mockReturnValue('Hello world text!')
      const {element} = render(() => <ExtendingComponent>{child}</ExtendingComponent>, {});
      expect(child.mock.calls.length).toBe(1); // Called exactly once
    });
  });
})
