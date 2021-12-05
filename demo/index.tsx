import { render } from 'solid-js/web'
import { styled, css } from '../src'

const section = css`
  background-color: #f6f8fa;
  color: #333;
`

const StyledSection = styled('div')`
  ${section}
  margin: 20px 0;
  padding: 20px;
`

function App() {
  return (
    <div>
      <h1>SolidJS With Emotion</h1>
      <StyledSection as="section">
        <p>
          This is a section created with <code>styled</code> function.
        </p>
      </StyledSection>
    </div>
  )
}

render(App, document.getElementById('root')!)
