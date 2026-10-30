import path from 'node:path';
import { defineConfig, transformWithOxc } from 'vite';
import react from '@vitejs/plugin-react';
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes';
import postcssPresetEnv from 'postcss-preset-env';

const src = path.resolve(import.meta.dirname, 'src');

// O código usa JSX em arquivos .js, que o Vite só interpreta como JSX em .jsx.
const jsxInJs = {
  name: 'jsx-in-js',
  enforce: 'pre',
  async transform(code, id) {
    if (!id.startsWith(src) || !id.endsWith('.js')) return null;
    return transformWithOxc(code, id, { lang: 'jsx', jsx: { runtime: 'automatic' } });
  },
};

export default defineConfig({
  plugins: [jsxInJs, react()],
  optimizeDeps: {
    // Idem para a varredura de dependências do servidor de desenvolvimento.
    rolldownOptions: { moduleTypes: { '.js': 'jsx' } },
  },
  resolve: {
    // Mesma ordem do webpack: sem 'jsnext:main', que levaria o moment ao build ESM e
    // quebraria quem faz require('moment') (react-moment, moment-timezone, locales).
    mainFields: ['browser', 'module', 'main'],
    // Imports absolutos a partir de src/ (ex.: 'components/Alert').
    alias: [
      { find: /^(actions|components|data|images|reducers|utils|views)(\/|$)/, replacement: `${src}/$1$2` },
    ],
  },
  css: {
    preprocessorOptions: {
      scss: { loadPaths: [src] },
    },
    postcss: {
      plugins: [
        postcssFlexbugsFixes(),
        postcssPresetEnv({ autoprefixer: { flexbox: 'no-2009' }, stage: 3 }),
      ],
    },
  },
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    watch: { usePolling: process.env.CHOKIDAR_USEPOLLING === 'true' },
  },
  build: {
    outDir: 'build',
    assetsInlineLimit: 10000,
    // O chunk vendor (MUI, Quill, GSAP, moment...) tem ~1,4 MB minificado.
    chunkSizeWarningLimit: 1600,
    rolldownOptions: {
      // O aviso de tempo de plugins só aponta o Sass, que é lento por natureza.
      checks: { bundlerTimings: false },
      output: {
        // O entrypoint.sh substitui API_URL em build/static/js/*.js.
        entryFileNames: 'static/js/main.[hash].js',
        chunkFileNames: 'static/js/[name].[hash].chunk.js',
        // Separa as dependências do código da aplicação, como fazia o webpack (splitChunks).
        // Um chunk vendor para o que é comum: dividi-lo por tamanho (maxSize) cria
        // imports circulares entre chunks CommonJS. As bibliotecas grandes usadas só
        // por algumas páginas (que carregam sob demanda) ficam em chunks próprios:
        // ninguém no vendor as importa, então não há ciclo.
        codeSplitting: {
          // Sem isso, cada grupo leva junto as dependências dos seus módulos (o
          // React iria para o chunk do Swiper e todo mundo importaria de lá).
          includeDependenciesRecursively: false,
          groups: [
            { name: 'quill', test: /node_modules\/(quill|react-quill-new|quill-delta-to-html|parchment|quill-delta)\//, priority: 2 },
            { name: 'gsap', test: /node_modules\/gsap\//, priority: 2 },
            { name: 'swiper', test: /node_modules\/(swiper|react-device-detect|ua-parser-js)\//, priority: 2 },
            { name: 'image-gallery', test: /node_modules\/react-image-gallery\//, priority: 2 },
            { name: 'moment-timezone', test: /node_modules\/(moment-timezone|react-moment)\//, priority: 2 },
            { name: 'vendor', test: /node_modules/, priority: 1 },
          ],
        },
        assetFileNames: ({ names }) =>
          names.some(name => name.endsWith('.css'))
            ? 'static/css/[name].[hash][extname]'
            : 'static/media/[name].[hash][extname]',
      },
    },
  },
});
