import { createComponent } from "solid-js/web";
import { createSignal } from "solid-js";
import { styled } from "../src/index";

const createComponentHelper = (component, props) => (createComponent(component, props) as () => Element)();

const Component = styled('div')({
  backgroundColor: 'green',
});

const InterpolatingComponent = styled('div')(({value}) => ({
  backgroundColor: value ? 'red' : 'blue',
}));

describe('styled', () => {
  it('works with single style property', () => {
    const element = createComponentHelper(Component, {});
    expect(window.getComputedStyle(element)['background-color']).toEqual('green');
  });

  it('works with interpolated style property', () => {
    const element = createComponentHelper(InterpolatingComponent, {value: true});
    expect(window.getComputedStyle(element)['background-color']).toEqual('red');
  });

  it('works with interpolated style property modified with signal', () => {
    const [value, setValue] = createSignal(false);
    const element = createComponentHelper(InterpolatingComponent, {get value() { return value() }});
    setValue(true);
    expect(window.getComputedStyle(element)['background-color']).toEqual('red');
  });
})
