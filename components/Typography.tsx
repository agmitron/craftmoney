import { PropsWithChildren, useMemo } from "react";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import { useTheme } from "./Themed";

interface Props {
  variant?: "title" | "subtitle" | "text";
  align?: "left" | "center" | "right";
  color?: string;
  style?: StyleProp<TextStyle>;
}

const Typography: React.FC<PropsWithChildren<Props>> = ({
  variant = "text",
  align = "left",
  color,
  children,
  style,
}) => {
  const theme = useTheme();

  const s = useMemo(
    () => ({
      ..._styles.common,
      ..._styles[variant],
      color: color ?? theme.colors.typography.primary,
      textAlign: align,
      ...(typeof style === "object" ? style : {}),
    }),
    []
  );

  return <Text style={s}>{children}</Text>;
};

const _styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {},
  text: {
    fontSize: 17,
  },
  common: {},
});

export default Typography;
