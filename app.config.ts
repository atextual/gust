export default defineAppConfig({
  refreshInterval: 4096,
  ui: {
    primary: "stone",
    gray: "stone",
    button: {
      color: {
        primary: {
          selected:
            "transition transition-colors rounded-lg bg-primary/20 dark:bg-primary-900/70 backdrop-contrast-75 text-gray-900 dark:text-white",
          unselected:
            "transition transition-colors dark:md:hover:bg-white/5 md:hover:bg-primary/10 text-gray-800 dark:text-white",
        },
      },
    },
  },
});
