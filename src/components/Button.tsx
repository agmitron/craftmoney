import { PropsWithChildren, useState } from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

import { useTheme } from "./Themed";
import { assertStyle } from "../shared/utils/style";

import { Theme } from "~/constants/theme";

type Variant = "contained" | "outlined" | "icon";
type Size = "small" | "medium" | "large";

interface Props extends PressableProps {
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
  size?: Size;
}

const Button: React.FC<PropsWithChildren<Props>> = ({
  children,
  style,
  variant = "contained",
  size = "small",
  disabled = false,
  ...props
}) => {
  const [isActive, setActive] = useState(false);
  const theme = useTheme();
  const styles = withTheme(theme, variant, size);

  const activeStyles = isActive ? styles._active : {};
  const disabledStyles = disabled ? styles._disabled : {};

  return (
    <Pressable
      onPressIn={() => setActive(true)}
      onPressOut={() => setActive(false)}
      style={{
        ...styles.common,
        ...styles[`variant_${variant}`],
        ...styles[`size_${size}`],
        ...activeStyles,
        ...disabledStyles,
        ...assertStyle(style),
      }}
      disabled={disabled}
      {...props}
    >
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
};

const withTheme = (t: Theme, variant: Variant, size: Size) =>
  StyleSheet.create({
    variant_contained: {
      backgroundColor: t.colors.primary,
      borderRadius: t.borderRadius,
    },
    variant_outlined: {
      borderRadius: t.borderRadius,
    },
    variant_icon: {
      width: 40,
      height: 40,
      borderRadius: 40 / 2,
      paddingVertical: 0,
      paddingHorizontal: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: t.colors.primary,
    },
    size_small: {},
    size_medium: {},
    size_large: {},
    _active: {
      opacity: 0.9,
    },
    _disabled: {
      opacity: 0.5,
      cursor: "not-allowed",
    },
    text: {
      color:
        variant === "contained" || variant === "icon"
          ? t.colors.typography.inverted
          : t.colors.primary,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: size === "large" ? 20 : 16,
      fontWeight: variant === "icon" ? "bold" : "normal",
      textAlign: "center",
    },
    common: {
      paddingVertical: 10,
      paddingHorizontal: 21,
      borderColor: t.colors.primary,
      borderWidth: 1,
    },
  });

export default Button;
