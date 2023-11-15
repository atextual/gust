export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,
  modules: ["@pinia/nuxt", "@nuxt/ui"],
  ui: {
    icons: ["tabler", "ph", "svg-spinners"],
  },
  plugins: ["@/plugins/Vue3Lottie.client.ts"],
});
