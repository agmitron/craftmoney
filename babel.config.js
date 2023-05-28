const extensions = [
  ".js",
  ".android.js",
  ".ios.js",
  ".jsx",
  ".android.jsx",
  ".ios.jsx",
  ".ts",
  ".android.ts",
  ".ios.ts",
  ".tsx",
  ".android.tsx",
  ".ios.tsx",
  ".json",
];

module.exports = function (api) {
  api.cache(true);
  
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      require.resolve("expo-router/babel"),
      [
        "module-resolver",
        {
          extensions,
          root: ["."],
          alias: {
            "~": ".",
          },
        },
      ],
      require.resolve("effector/babel-plugin")
    ],
  };
};
