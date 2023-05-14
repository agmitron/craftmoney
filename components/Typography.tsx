import { PropsWithChildren, useMemo } from "react";
import { StyleSheet, Text } from "react-native";
import { useTheme } from "./Themed";

interface Props {
  variant?: "title" | "subtitle" | "text";
  align?: "left" | "center" | "right";
  color?: string;
}

const Typography: React.FC<PropsWithChildren<Props>> = ({
  variant = "text",
  align = "left",
  color,
  children,
}) => {
  const theme = useTheme();

  const style = useMemo(
    () => ({
      ...styles.common,
      ...styles[variant],
      color: color ?? theme.colors.typography.primary,
      textAlign: align,
    }),
    []
  );

  return <Text style={style}>{children}</Text>;
};

const styles = StyleSheet.create({
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
