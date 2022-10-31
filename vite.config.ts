import { builtinModules } from 'module';
import { join } from 'path';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import dts from 'vite-plugin-dts';

const PACKAGE_ROOT = __dirname;

const config = defineConfig({
  mode: process.env['MODE'],
  root: PACKAGE_ROOT,
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./**/*.{cjs,js,ts}"',
      },
    }),
  ],
  build: {
    sourcemap: true,
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      external: [
        '@prisma/client',
        ...builtinModules.reduce((prev, p) => [...prev, p, `node:${p}`], [] as string[]),
      ],
      output: {
        globals: {
          '@prisma/client': '@prisma/client',
          util: 'util',
          path: 'path',
          tty: 'tty',
          url: 'url',
          fs: 'fs',
        },
      },
    },
    emptyOutDir: true,
    minify: 'esbuild',
    lib: {
      entry: join(PACKAGE_ROOT, 'src/index.ts'),
      formats: ['es', 'umd'],
      name: 'prisma-mock-vitest',
      fileName: (format) => `index.${format}.js`,
    },
  },
  test: {
    globals: true,
  },
});

export default config;
