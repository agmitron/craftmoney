// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(path.resolve());

// Remove all console logs in production...
config.transformer.minifierConfig.compress.drop_console = true;
config.resolver.sourceExts = [...config.resolver.sourceExts, "mjs", "cjs"];
module.exports = config;
