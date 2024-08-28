import { PropsWithChildren, useState } from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  View,
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
  icon?: React.ReactNode;
}

const Button: React.FC<PropsWithChildren<Props>> = ({
  children,
  style,
  variant = "contained",
  size = "small",
  disabled = false,
  icon,
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
      <View style={styles.icon_container}>
        <View
          style={{
            width: 32,
            height: 32,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {variant === "icon" && icon}
        </View>
      </View>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
};

const withTheme = (t: Theme, variant: Variant, size: Size) => {
  const textColorOptions: Record<Variant, string> = {
    contained: t.colors.background,
    outlined: t.colors.primary,
    icon: t.colors.primary,
  };

  return StyleSheet.create({
    variant_contained: {
      backgroundColor: t.colors.primary,
      borderRadius: t.borderRadius,
    },
    variant_outlined: {
      borderRadius: t.borderRadius,
    },
    variant_icon: {
      borderColor: "transparent",
    },
    size_small: {},
    size_medium: {},
    size_large: {},
    _active: {
      opacity: 0.9,
    },
    _disabled: {
      opacity: 0.5,
    },
    text: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: size === "large" ? 20 : 14,
      textAlign: "center",
      color: textColorOptions[variant],
      fontWeight: variant === "icon" ? "bold" : "normal",
      marginTop: variant === "icon" ? 5 : 0,
    },
    common: {
      paddingVertical: 10,
      paddingHorizontal: 21,
      borderColor: t.colors.primary,
      borderWidth: 1,
    },
    icon_container: {
      justifyContent: "center",
      flexDirection: "column",
    },
  });
};

export default Button;
