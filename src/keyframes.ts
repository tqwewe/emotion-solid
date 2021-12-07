// Reference https://github.dev/emotion-js/emotion/blob/26ded6109fcd8ca9875cc2ce4564fee678a3f3c5/packages/react/src/keyframes.js#L24
import { css } from './css'
import { CSSInterpolation, Keyframes } from '@emotion/serialize'

function keyframes(
  template: TemplateStringsArray,
  ...args: Array<CSSInterpolation>
): Keyframes
function keyframes(...args: Array<CSSInterpolation>): Keyframes
function keyframes(...args: any[]): Keyframes {
  let insertable = css(...args)
  const name = `animation-${insertable.name}`
  // @ts-expect-error Keyframes type could never be fit as it unions string and object
  return {
    name,
    styles: `@keyframes ${name}{${insertable.styles}}`,
    anim: 1,
    toString() {
      return `_SOLID_EMOTION_${this.name}_${this.styles}_SOLID_EMOTION_`
    },
  }
}

export { keyframes }
