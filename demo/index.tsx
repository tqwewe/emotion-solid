import { render } from 'solid-js/web'
import { styled, css, keyframes } from '../src'

const progress = keyframes`
  0% {
    width: 0;
  }
  50% {
    width: 100%;
  }
  100% {
    width: 0;
  }
`;

const section = css`
  background-color: #f6f8fa;
  color: #333;
`

const StyledSection = styled('div')`
  ${section}
  margin: 20px 0;
  padding: 20px;
`

const Animation = styled('div')`
  height: 20px;
  background-color: #007cd3;
  animation: ${progress} 2s linear infinite;
`;

function App() {
  return (
    <div>
      <h1>SolidJS With Emotion</h1>
      <StyledSection as="section">
        <p>
          This is a section created with <code>styled</code> function.
        </p>
        <Animation />
      </StyledSection>
    </div>
  )
}

render(App, document.getElementById('root')!)
