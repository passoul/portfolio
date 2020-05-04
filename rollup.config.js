import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import autoPreprocess from "svelte-preprocess";
import { terser } from "rollup-plugin-terser";
import babel from "rollup-plugin-babel";
import smelte from "smelte/rollup-plugin-smelte";

// Const
const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/static/js/bundle.js",
  },
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // adding the preprocess into svelte loader
      // preprocess,
      preprocess: autoPreprocess({ postcss: true }),
      emitCss: false,
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css: (css) => {
        css.write("public/static/css/bundle.css");
      },
      // css: true,
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),
    smelte({
      purge: production,
      output: "public/static/css/global.css", // it defaults to static/global.css which is probably what you expect in Sapper
      postcss: [], // Your PostCSS plugins
      whitelist: [], // Array of classnames whitelisted from purging
      whitelistPatterns: [], // Same as above, but list of regexes
      tailwind: [], // Any other props will be applied on top of default Smelte tailwind.config.js
    }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
    babel({
      exclude: "node_modules/**",
    }),
  ],
  watch: {
    clearScreen: false,
  },
};

function serve() {
  let started = false;

  return {
    writeBundle() {
      if (!started) {
        started = true;

        require("child_process").spawn("npm", ["run", "start", "--", "--dev"], {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        });
      }
    },
  };
}
