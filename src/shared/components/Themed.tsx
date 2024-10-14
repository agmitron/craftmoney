/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import theme, { Theme } from "~/shared/constants/theme";

export function useTheme(_variant: "light" | "dark" = "light"): Theme {
  // return theme[variant];
  return theme.light; // TODO
}
