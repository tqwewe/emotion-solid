import { render } from 'solid-js/web'
// import { styled } from '../dist/index.esm.js'
import { styled } from '../src'

const StyledSection = styled('div')`
  background-color: #f6f8fa;
  margin: 20px 0;
  padding: 20px;
  color: #333;
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
