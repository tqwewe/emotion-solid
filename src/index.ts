import { createStyled } from './base'
import { tags } from './tags'
import { css } from './css'
import { keyframes } from './keyframes'

type Styled = OmitThisParameter<typeof createStyled>

type BoundStyled = ReturnType<Styled>

// bind it to avoid mutating the original function
// @ts-ignore
const styled = createStyled.bind() as Styled &
  Record<typeof tags[number], BoundStyled>

tags.forEach((tagName: any) => {
  ;(styled as any)[tagName] = styled(tagName)
})

export { styled, css, keyframes }
