import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

// biome-ignore lint/style/noDefaultExport: Rsbuild requires default export.
export default defineConfig({
  source: {
    entry: { index: './index.tsx' },
  },
  plugins: [pluginReact()],
  html: {
    title: 'Chinese Whisper AI',
  },
})
