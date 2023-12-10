// @ts-nocheck
import path from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
//import { visualizer } from "rollup-plugin-visualizer"

const viteEdUiHmrPlugin = () => {
  const fileRegex = /\.(js)$/

  function generateHmrPreamble(code) {
    const preamble = `\nif (import.meta.hot) {
    import.meta.hot.accept(function(newModule) {
        getEdApp().swapModuleInstances(newModule);
    });
}\n`

    return `${preamble} \n \n ${code}`;
  }
  return {
    name: 'edui-hmr-plugin',
    transform(code, id) {
      if (code.includes("EdUiElement") || code.includes("EdUiComponent")) {
        // dev: plugin invoked by dev server
        return {
          code: generateHmrPreamble(code),
          map: null, // provide source map if available
        }
      }
    },
    // handleHotUpdate({ server, file, timestamp, modules }) {
    //   server.ws.send({
    //     type: 'custom',
    //     event: 'edui-hmr-event',
    //     data: {file}
    //   })
    //   return []
    // }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    modules: {
      // https://github.com/webpack/loader-utils#interpolatename
      generateScopedName: `[folder]__[local]`,
      // @ts-ignore
      root: `.`,
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, `src`),
    },
  },
  server: {
    open: true,
  },
  esbuild: {
    minifyIdentifiers: false,
    keepNames: true,
  },
  plugins: [
    svgr(),
    viteEdUiHmrPlugin()
    // visualizer({
    //   emitFile: true,
    // }),
  ],
})
