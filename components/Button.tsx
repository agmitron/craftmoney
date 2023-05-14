import { Pressable, Text, StyleSheet, PressableProps } from "react-native";
import { useTheme } from "./Themed";
import { Theme } from "../constants/theme";
import { PropsWithChildren } from "react";

type Variant = "contained" | "outlined";

interface Props extends PressableProps {
  variant?: Variant;
}

const Button: React.FC<PropsWithChildren<Props>> = ({
  children,
  style,
  variant = "contained",
  ...props
}) => {
  const theme = useTheme();
  const styles = withTheme(theme, variant);

  return (
    <Pressable
      style={{
        ...styles.common,
        ...styles[variant],
        ...(typeof style === "object" ? style : {}),
      }}
      {...props}
    >
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
};

const withTheme = (t: Theme, variant: Variant) =>
  StyleSheet.create({
    contained: {
      backgroundColor: t.colors.primary,
      borderRadius: t.borderRadius,
    },
    outlined: {
      borderRadius: t.borderRadius,
    },
    text: {
      color:
        variant === "contained"
          ? t.colors.typography.inverted
          : t.colors.primary,
      textAlign: "center",
      fontSize: 16,
    },
    common: {
      paddingVertical: 10,
      paddingHorizontal: 21,
      borderColor: t.colors.primary,
      borderWidth: 1,
    },
  });

export default Button;
