// Reference https://github.dev/emotion-js/emotion/blob/26ded6109fcd8ca9875cc2ce4564fee678a3f3c5/packages/react/src/css.js#L11
import type { SerializedStyles } from '@emotion/utils'
import { CSSInterpolation, serializeStyles } from '@emotion/serialize'

function css(
  template: TemplateStringsArray,
  ...args: Array<CSSInterpolation>
): SerializedStyles
function css(...args: Array<CSSInterpolation>): SerializedStyles
function css(
  ...args: Array<TemplateStringsArray | CSSInterpolation>
): SerializedStyles {
  // @ts-expect-error https://github.com/emotion-js/emotion/pull/2572
  return serializeStyles(args)
}

export { css }
