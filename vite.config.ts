import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  root: './demo',
  // TOOD: Removing `hot` will crash dev environment.
  plugins: [solidPlugin({hot: false})],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
})
