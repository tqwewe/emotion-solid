import { createContext, useContext, JSX } from 'solid-js'
import createCache from '@emotion/cache'
import type { EmotionCache } from '@emotion/utils'

const isBrowser = typeof document !== 'undefined'

let EmotionCacheContext = /* #__PURE__ */ createContext(
  // we're doing this to avoid preconstruct's dead code elimination in this one case
  // because this module is primarily intended for the browser and node
  // but it's also required in react native and similar environments sometimes
  // and we could have a special build just for that
  // but this is much easier and the native packages
  // might use a different theme context in the future anyway
  typeof HTMLElement !== 'undefined'
    ? /* #__PURE__ */ createCache({ key: 'css' })
    : null
)

export let CacheProvider = EmotionCacheContext.Provider

let withEmotionCache = function withEmotionCache<Props>(
  func: (props: Props, cache: EmotionCache | null) => JSX.Element
) {
  return (props: Props) => {
    // the cache will never be null in the browser
    let cache = useContext(EmotionCacheContext) as any as EmotionCache

    return func(props, cache)
  }
}

if (!isBrowser) {
  ;(withEmotionCache as any) = function withEmotionCache<Props>(
    func: (props: Props, cache: EmotionCache | null) => JSX.Element
  ) {
    return (props: Props) => {
      let cache = useContext(EmotionCacheContext)
      if (cache === null) {
        // yes, we're potentially creating this on every render
        // it doesn't actually matter though since it's only on the server
        // so there will only every be a single render
        // that could change in the future because of suspense and etc. but for now,
        // this works and i don't want to optimise for a future thing that we aren't sure about
        cache = createCache({ key: 'css' })
        return (
          // @ts-ignore
          <EmotionCacheContext.Provider value={cache}>
            {func(props, cache)}
          </EmotionCacheContext.Provider>
        )
      } else {
        return func(props, cache)
      }
    }
  }
}

export { withEmotionCache }
