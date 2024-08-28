// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

module.exports = () => {
  const config = getDefaultConfig(path.resolve());
  // Remove all console logs in production...
  config.transformer.minifierConfig.compress.drop_console = true;
  config.resolver.sourceExts = [...config.resolver.sourceExts, "mjs", "cjs"];

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
  };

  return config;
};
