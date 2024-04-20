const defaultConfig = require("@wordpress/scripts/config/webpack.config");

// オリジナルをカスタマイズ
module.exports = {
  ...defaultConfig,
  output: {
    ...defaultConfig.output,
    libraryTarget: "umd",
  },
};
