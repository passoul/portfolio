const production = !process.env.ROLLUP_WATCH;
const purgecss = require("@fullhuman/postcss-purgecss");

module.exports = {
  plugins: [
    require("postcss-import")(),
    require("tailwindcss")("./node_modules/smelte/tailwind.config.js"),
    require("autoprefixer"),
    production &&
      purgecss({
        content: [
          "./src/**/*.svelte",
          "./src/*.svelte",
          "./src/**/**/*.svelte",
          "./src/**/**/**/*.svelte",
        ],
        whitelist: [],
        whitelistPatterns: [/:[\w-:]+/],
        defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
      }),
  ],
};
