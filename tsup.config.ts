import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  bundle: true,
  cjsInterop: false,
  dts: true,
  format: 'esm',
  external: ['react', 'react-node', 'next', 'react/jsx-runtime'],
  loader: {
    '.tsx': 'tsx',
  }
})