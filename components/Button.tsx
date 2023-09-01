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
import { Theme } from "../constants/theme";
import { assertStyle } from "../utils/style";

type Variant = "contained" | "outlined";
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
        variant === "contained"
          ? t.colors.typography.inverted
          : t.colors.primary,
      textAlign: "center",
      fontSize: size === "large" ? 20 : 16,
    },
    common: {
      paddingVertical: 10,
      paddingHorizontal: 21,
      borderColor: t.colors.primary,
      borderWidth: 1,
    },
  });

export default Button;
