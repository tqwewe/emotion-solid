import { createSignal } from 'solid-js';
import { styled } from '../src/index';
import { render } from './helper';

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

  it('outputs children as is', () => {
    const {element} = render(() => <Component>Test</Component>);
    expect(element.textContent).toEqual('Test');
  });

  it('passes attributes to element itself', () => {
    const Link = styled('a')({
      backgroundColor: 'white',
    });
    const {element} = render(() => <Link href="cool">Test</Link>, {});
    expect(element.getAttribute('href')).toEqual('cool');
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

  it('supports ref arguments', () => {
    let elementRef;
    const {element} = render(() => <Component ref={elementRef} />, {});
    expect(elementRef).toEqual(element);
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

    it('supports ref arguments', () => {
      const ExtendingComponent = styled(Component)({});
      let elementRef;
      const {element} = render(() => <ExtendingComponent ref={elementRef} />, {});
      expect(elementRef).toEqual(element);
    });
  });
})
