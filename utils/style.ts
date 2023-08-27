import { StyleProp, ViewStyle } from "react-native";

export const assertStyle = <T extends ViewStyle>(
  style: StyleProp<T>,
): StyleProp<T> => {
  if (typeof style === "object") {
    return style;
  }

  return {} as T;
};
