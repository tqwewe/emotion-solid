import { createSignal } from 'solid-js';
import { styled, ThemeProvider, useTheme } from '../src/index';
import { render } from './helper';

describe('useTheme', () => {
  it('returns empty theme if it is not set', () => {
    let retrievedTheme;
    const HelperComponent = () => {
      retrievedTheme = useTheme();
    };
    const {element} = render(() => <HelperComponent />, {});
    expect(retrievedTheme).toEqual({});
  });

  it('returns the theme', () => {
    let retrievedTheme;
    const HelperComponent = () => {
      retrievedTheme = useTheme();
    };
    const theme = {
      color: 'green'
    };
    const {element} = render(() => <ThemeProvider theme={() => theme}><HelperComponent /></ThemeProvider>, {});
    expect(retrievedTheme.color).toEqual('green');
  });
});

describe('theme in styled', () => {
  const Component = styled('div')(({theme}) => ({
    backgroundColor: theme.color,
  }));

  it('works with single style property', () => {
    const theme = {
      color: 'green'
    };
    const {element} = render(() => <ThemeProvider theme={() => theme}><Component /></ThemeProvider>, {});
    expect(window.getComputedStyle(element)['background-color']).toEqual('green');
  });

  it('updates if theme changes', () => {
    const [theme, setTheme] = createSignal({
      color: 'green'
    });
    const {element} = render(() => <ThemeProvider theme={theme}><Component /></ThemeProvider>, {});
    setTheme({
      color: 'yellow'
    });
    expect(window.getComputedStyle(element)['background-color']).toEqual('yellow');
  });
});
