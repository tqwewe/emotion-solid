import { Component, createMemo, mergeProps } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import { serializeStyles } from '@emotion/serialize'
import { getRegisteredStyles, insertStyles, RegisteredCache } from '@emotion/utils'

import { withEmotionCache } from './context'
import { useTheme } from './theme'
import {
  getDefaultShouldForwardProp,
  composeShouldForwardProps,
  StyledOptions,
  PrivateStyledComponent,
  StyledElementType,
  CreateStyledFunction,
} from './utils'

const ILLEGAL_ESCAPE_SEQUENCE_ERROR = `You have illegal escape sequence in your template literal, most likely inside content's property value.
Because you write your CSS inside a JavaScript string you actually have to do double escaping, so for example "content: '\\00d7';" should become "content: '\\\\00d7';".
You can read more about this here:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences`

const isBrowser = typeof document !== 'undefined'

const createStyled: CreateStyledFunction = (tag: any, options?: StyledOptions) => {
  if (process.env.NODE_ENV !== 'production') {
    if (tag === undefined) {
      throw new Error(
        'You are trying to create a styled element with an undefined component.\nYou may have forgotten to import it.'
      )
    }
  }
  const isReal = tag.__emotion_real === tag
  const baseTag = (isReal && tag.__emotion_base) || tag

  let identifierName: string | undefined
  let targetClassName: string | undefined
  if (options !== undefined) {
    identifierName = options.label
    targetClassName = options.target
  }

  const shouldForwardProp = composeShouldForwardProps(tag, options, isReal)
  const defaultShouldForwardProp =
    shouldForwardProp || getDefaultShouldForwardProp(baseTag)
  const shouldUseAs = !defaultShouldForwardProp('as')

  return function <Props>(...args: (object | ((props: Props & {theme: any}) => object))[]) {
    let styles: any[] =
      isReal && tag.__emotion_styles !== undefined
        ? tag.__emotion_styles.slice(0)
        : []

    if (identifierName !== undefined) {
      styles.push(`label:${identifierName};`)
    }
    if (args[0] == null || (args as any)[0].raw === undefined) {
      styles.push.apply(styles, args)
    } else {
      if (
        process.env.NODE_ENV !== 'production' &&
        (args as any)[0][0] === undefined
      ) {
        console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR)
      }
      styles.push((args as any)[0][0])
      let len = args.length
      let i = 1
      for (; i < len; i++) {
        if (
          process.env.NODE_ENV !== 'production' &&
          (args as any)[0][i] === undefined
        ) {
          console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR)
        }
        styles.push(args[i], (args as any)[0][i])
      }
    }

    const Styled = withEmotionCache<
      Props & { as?: string; class?: string }
    >((props, cache) => {
      const finalTag = (shouldUseAs && props.as) || baseTag

      let classInterpolations: string[] = []

      const getClassNameAndRegisteredStyles = createMemo<[string, RegisteredCache]>(() => {
        if (typeof (props as any).className === 'string') {
          // Note that the below function is not just getter
          // and it also inserts the rules to stylesheet
          const className = getRegisteredStyles(
            cache?.registered!,
            classInterpolations,
            (props as any).className
          )
          return [className, cache?.registered!]
        } else if ((props as any).className != null) {
          const className = `${(props as any).className} `
          return [className, {}]
        }
        return ['', {}]
      })

      const getRules = createMemo(() => {
        let mergedProps: Record<string, any> = mergeProps(
          props,
          {
            get theme() {return useTheme()}
          }
        )

        const [_, registeredStyles] = getClassNameAndRegisteredStyles()
        const serialized = serializeStyles(
          styles.concat(classInterpolations),
          registeredStyles,
          mergedProps
        )

        const rules = insertStyles(
          cache!,
          serialized,
          typeof finalTag === 'string'
        )

        return { rules, serialized }
      })

      const className = createMemo(() => {
        let [className, _] = getClassNameAndRegisteredStyles()

        const rulesSerialized = getRules()

        className += `${cache?.key}-${rulesSerialized.serialized.name}`
        if (targetClassName !== undefined) {
          className += ` ${targetClassName}`
        }

        return className
      })

      // const finalShouldForwardProp =
      //   shouldUseAs && shouldForwardProp === undefined
      //     ? getDefaultShouldForwardProp(finalTag)
      //     : defaultShouldForwardProp

      const newProps: Record<string, any> = mergeProps(props)

      // for (let key in props) {
      // if (key === 'className' || key === 'ref') continue

      // if (shouldUseAs && key === 'as') {
      //   delete newProps[key]
      //   continue
      // }

      // if (!finalShouldForwardProp(key)) {
      //   delete newProps[key]
      //   // newProps[key] = (props as any)[key]
      // }
      // }

      // newProps.className = className
      // newProps.ref = ref

      const element = (
        <Dynamic
          component={finalTag}
          {...newProps}
          className={
            props.class ? `${className()} ${props.class}` : className()
          }
        />
      )
      if (!isBrowser && getRules().rules !== undefined) {
        const rulesSerialized = getRules()
        let serializedNames = rulesSerialized.serialized.name
        let next = rulesSerialized.serialized.next
        while (next !== undefined) {
          serializedNames += ' ' + next.name
          next = next.next
        }
        return (
          <>
            <style
              {...{
                [`data-emotion`]: `${cache?.key} ${serializedNames}`,
                dangerouslySetInnerHTML: { __html: rulesSerialized.rules },
                nonce: cache?.sheet.nonce,
              }}
            />
            {element}
          </>
        )
      }

      return element
    })

    // Styled.displayName =
    //   identifierName !== undefined
    //     ? identifierName
    //     : `Styled(${
    //         typeof baseTag === 'string'
    //           ? baseTag
    //           : baseTag.displayName || baseTag.name || 'Component'
    //       })`
    // ;(Styled as any).defaultProps = tag.defaultProps(
    //   Styled as any
    // ).__emotion_real = Styled
    ;(Styled as any).__emotion_base = baseTag
    ;(Styled as any).__emotion_styles = styles
    ;(Styled as any).__emotion_forwardProp = shouldForwardProp

    Object.defineProperty(Styled, 'toString', {
      value() {
        if (
          targetClassName === undefined &&
          process.env.NODE_ENV !== 'production'
        ) {
          return 'NO_COMPONENT_SELECTOR'
        }
        return `.${targetClassName}`
      },
    })
    ;(Styled as any).withComponent = (
      nextTag: StyledElementType<Props>,
      nextOptions?: StyledOptions
    ) => {
      return createStyled(nextTag, {
        ...options,
        ...nextOptions,
        shouldForwardProp: composeShouldForwardProps(
          Styled as any,
          nextOptions,
          true
        ),
      })(
        // @ts-ignore
        ...styles
      )
    }

    return Styled as Component<Props & { as?: string; class?: string }>
  }
}

export default createStyled
