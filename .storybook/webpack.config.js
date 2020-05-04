const path = require("path");

module.exports = ({ config, mode }) => {
  const svelteLoader = config.module.rules.find(
    (r) => r.loader && r.loader.includes("svelte-loader")
  );
  svelteLoader.options = {
    ...svelteLoader.options,
    emitCss: false,
    hotReload: false,
  };

  config.module.rules.push(
    {
      test: /\.css$/,
      loaders: [
        {
          loader: "postcss-loader",
          options: {
            sourceMap: true,
            config: {
              path: "./.storybook/",
            },
          },
        },
      ],

      include: path.resolve(__dirname, "../storybook/"),
    },
    {
      test: /\.stories\.js?$/,
      loaders: [require.resolve("@storybook/source-loader")],
      include: [path.resolve(__dirname, "../storybook")],
      enforce: "pre",
    }
  );
  // config.resolve.modules = [
  //   ...(config.resolve.modules || []),
  //   path.resolve("./src/"),
  //   path.resolve("./storybook/"),
  // ];

  return config;
};
