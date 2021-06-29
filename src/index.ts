import styledImport from './base'
import { tags } from './tags'

// bind it to avoid mutating the original function
// @ts-ignore
export const styled = styledImport.bind()

tags.forEach((tagName: any) => {
  ;(styled as any)[tagName] = styled(tagName)
})
