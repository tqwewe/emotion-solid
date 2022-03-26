import { createSignal } from 'solid-js';
import { styled, ThemeProvider, useTheme } from '../src/index';
import { render } from './helper';

describe('useTheme', () => {
  it('returns the theme', () => {
    let retrievedTheme;
    const HelperComponent = () => {
      retrievedTheme = useTheme();
    };
    const theme = {
      color: 'green'
    };
    const {element} = render(() => <ThemeProvider theme={theme}><HelperComponent /></ThemeProvider>, {});
    expect(retrievedTheme.color).toEqual('green');
  });
});

const Component = styled('div')(({theme}) => ({
  backgroundColor: theme.color,
}));

describe('theme in styled', () => {
  it('works with single style property', () => {
    const theme = {
      color: 'green'
    };
    const {element} = render(() => <ThemeProvider theme={theme}><Component /></ThemeProvider>, {});
    expect(window.getComputedStyle(element)['background-color']).toEqual('green');
  });
});
