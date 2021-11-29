import { createStyled } from './base'
import { tags } from './tags'

// bind it to avoid mutating the original function
// @ts-ignore
export const styled = createStyled.bind()

tags.forEach((tagName: any) => {
  ;(styled as any)[tagName] = styled(tagName)
})
