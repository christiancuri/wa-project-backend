const esbuildPluginTsc = require("./esbuild-plugin.js");

module.exports = {
  outDir: "./dist",
  esbuild: {
    minify: false,
    target: "es2020",
    plugins: [esbuildPluginTsc()],
  },
  assets: {
    baseDir: "src",
    filePatterns: ["**/*.json"],
  },
};
