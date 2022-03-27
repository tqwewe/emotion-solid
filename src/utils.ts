import { Component, JSX } from 'solid-js'

import isPropValid from '@emotion/is-prop-valid'

export type RefCallback<T> = {
  bivarianceHack(instance: T | null): void
}['bivarianceHack']
export interface RefObject<T> {
  readonly current: T | null
}
export type Ref<T> = RefCallback<T> | RefObject<T> | null

export type ElementType<P = any> =
  | {
      [K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K]
        ? K
        : never
    }[keyof JSX.IntrinsicElements]
  | Component<P>

export type Interpolations<Props extends object> = Array<(object | ((props: Props & { theme: any }) => object))>;


export type StyledElementType<Props> =
  | string
  | Component<Props & { className: string }>

export type StyledOptions = {
  label?: string
  shouldForwardProp?: (str: string) => boolean
  target?: string
}

export type StyledComponent<Props> = Component<Props> & {
  defaultProps: any
  toString: () => string
  withComponent: (
    nextTag: StyledElementType<Props>,
    nextOptions?: StyledOptions
  ) => StyledComponent<Props>
}

export type PrivateStyledComponent<Props> = StyledComponent<Props> & {
  __emotion_real: StyledComponent<Props>
  __emotion_base: any
  __emotion_styles: any
  __emotion_forwardProp: any
}

const testOmitPropsOnStringTag = isPropValid
const testOmitPropsOnComponent = (key: string) => key !== 'theme'

export const getDefaultShouldForwardProp = (tag: ElementType) =>
  typeof tag === 'string' &&
  // 96 is one less than the char code
  // for "a" so this is checking that
  // it's a lowercase character
  tag.charCodeAt(0) > 96
    ? testOmitPropsOnStringTag
    : testOmitPropsOnComponent

export const composeShouldForwardProps = (
  tag: PrivateStyledComponent<any>,
  options: StyledOptions | void,
  isReal: boolean
) => {
  let shouldForwardProp
  if (options) {
    const optionsShouldForwardProp = options.shouldForwardProp
    shouldForwardProp =
      tag.__emotion_forwardProp && optionsShouldForwardProp
        ? (propName: string) =>
            tag.__emotion_forwardProp(propName) &&
            optionsShouldForwardProp(propName)
        : optionsShouldForwardProp
  }

  if (typeof shouldForwardProp !== 'function' && isReal) {
    shouldForwardProp = tag.__emotion_forwardProp
  }

  return shouldForwardProp
}

export type CreateStyledComponent = <Props extends object>(
  ...args: Interpolations<Props>
) => StyledComponent<Props>

export type CreateStyled = {
  <Props extends object>(tag: StyledElementType<Props>, options?: StyledOptions): (
    ...args: Interpolations<Props>
  ) => StyledComponent<Props>
  [key: string]: CreateStyledComponent
  // bind: () => CreateStyled
}

// The following code is inspired by create-emotion-styled

export interface StyledOtherComponent<Props extends object, InnerProps extends object> extends Component<Props & InnerProps & { as?: string; class?: string }> {}

export interface CreateStyledFunction {
  <T extends keyof JSX.IntrinsicElements>(tag: T, options?: StyledOptions): <Props extends object>(...args: Interpolations<Props>) => StyledOtherComponent<Props, JSX.IntrinsicElements[T]>
    <InnerProps extends object>(tag: Component<InnerProps>, options?: StyledOptions): <Props extends object>(...args: Interpolations<Props>) => StyledOtherComponent<Props, InnerProps>
}
