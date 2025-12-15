import {build, createServer, defineConfig, preview} from "vite";
import {VitePWA} from "vite-plugin-pwa";
import solid from "vite-plugin-solid";

const config = defineConfig({
  plugins: [
    solid(),
    VitePWA({
      filename: "service-worker.js",
      registerType: "autoUpdate",
      injectRegister: "inline",
      manifest: false,
      minify: true,
      devOptions: {
        enabled: false
      },
      workbox: {
        globPatterns: ["**/*.{html,css,js,json,webmanifest,png,jpg,svg,mp3,mp4,webm,webp,weba,ttf,otf,woff,woff2}"],
        inlineWorkboxRuntime: true,
        skipWaiting: true,
        clientsClaim: true
      }
    })
  ],
  root: "source/",
  base: "./",
  publicDir: false,
  envDir: "../",
  css: {
    devSourcemap: true
  },
  build: {
    target: "esnext",
    modulePreload: {
      polyfill: false
    },
    outDir: "../public",
    assetsDir: "./",
    assetsInlineLimit: 0,
    cssCodeSplit: false,
    emptyOutDir: true,
    minify: true,
    rollupOptions: {
      output: {
        assetFileNames: ({name}) => name === "style.css" ? "index.css" : name,
        entryFileNames: "index.js"
      }
    }
  }
});

await (async () => {
  if (process.argv.includes("build")) {
    await build(config);
  }
  else if (process.argv.includes("serve")) {
    const server = await preview(config);
    server.printUrls();
  }
  else {
    const server = await createServer(config);
    await server.listen();
    server.printUrls();
  }
})();
