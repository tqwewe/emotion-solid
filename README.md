<h1 align="center">Emotion Solid</h1>

<div align="center">
  Emotion JS support for Solid JS.
</div>

<br>

## Installation

```bash
npm i emotion-solid
# or
yarn add emotion-solid
```

## Usage

```ts
import { styled } from 'emotion-solid'

export type ButtonProps = {
  block?: boolean
}

const StyledButton = styled('button')<ButtonProps>(
  {
    display: 'inline-block',
    padding: '8px 6px',
    borderRadius: 8,
  },
  ({ block }) =>
    block && {
      display: 'block',
      width: '100%',
    }
)

const Button: Component<ButtonProps> = (props) => {
  return <StyledButton {...props}>{props.children}</StyledButton>
}

export default Button
```

```tsx
import { render } from 'solid-js/web'
import Button from './Button'

function App() {
  return <Button block>Click Me</Button>
}

render(() => <App />, document.getElementById('app'))
```

## Contributing 🙌

Contributions are more than welcome. If you see any changes fit, go ahead and open an issue or PR.

---

Any support is a huge motivation, thank you very much!

<a href="https://www.buymeacoffee.com/ariseyhun" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-orange.png" alt="Buy Me A Coffee" height="32" width="140"></a>
