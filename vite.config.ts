import { defineConfig } from 'vite'
import { vitePlugin as remix } from '@remix-run/dev'

export default defineConfig({
  plugins: [
    remix({
      appDirectory: "app",
      buildDirectory: "build",
      ignoredRouteFiles: ["**/*.css"],
      serverModuleFormat: "esm",
    })
  ],
  build: {
    cssMinify: true,
  },
})
