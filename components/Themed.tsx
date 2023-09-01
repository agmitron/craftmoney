/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { useColorScheme } from "react-native";

import theme, { Theme } from "../constants/theme";

export function useTheme(_variant: "light" | "dark" = "light"): Theme {
  const variant = useColorScheme() ?? _variant;
  // return theme[variant];
  return theme.light; // TODO
}
