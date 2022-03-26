import { useContext, createContext, Component } from 'solid-js';

const ThemeContext = createContext(() => ({}));

export function useTheme(): any {
  return useContext(ThemeContext)();
}

export const ThemeProvider: Component<{theme: () => any}> = (props) => {
  return (
    <ThemeContext.Provider value={props.theme}>
      {props.children}
    </ThemeContext.Provider>
  )
};
