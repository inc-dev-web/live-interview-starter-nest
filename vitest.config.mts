import { defineConfig } from 'vitest/config'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import swc from 'unplugin-swc'

export default defineConfig({
  plugins: [viteTsconfigPaths(), swc.vite()],
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.e2e-spec.ts'],
  },
})
