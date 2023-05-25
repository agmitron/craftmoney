import { ReactNode } from "react";
import { TextInput, StyleSheet, View, TextInputProps } from "react-native";
import { useTheme } from "./Themed";
import { assertStyle } from "../utils/style";
import { Theme } from "../constants/theme";

interface Props extends TextInputProps {
  decorations?: {
    left?: ReactNode;
    right?: ReactNode;
  };
  variant?: "outlined" | "filled" | "underlined" | "plain";
  size?: "small" | "medium" | "large";
}

const Input: React.FC<Props> = ({
  decorations,
  style,
  variant = "filled",
  size = "small",
  ...props
}) => {
  const theme = useTheme();
  const styles = withTheme(theme);

  return (
    <View style={{ ...styles.root, ...assertStyle(style) }}>
      <View style={{ ...styles.decoration, left: 0 }}>
        {decorations?.left && decorations.left}
      </View>
      <TextInput
        style={{
          ...styles.input,
          ...styles[`input_size_${size}`],
          ...styles[`input_variant_${variant}`],
        }}
        placeholderTextColor={theme.colors.typography.secondary}
        {...props}
      />
      <View style={{ ...styles.decoration, right: 0 }}>
        {decorations?.right && decorations.right}
      </View>
    </View>
  );
};

const withTheme = (t: Theme) =>
  StyleSheet.create({
    root: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      position: "relative",
      width: "100%",
    },
    input: {
      borderRadius: 10,
      width: "100%",
      fontSize: 17
    },
    input_size_large: {
      paddingVertical: 16,
      paddingLeft: 41,
      fontSize: 20,
    },
    input_size_small: {
      paddingVertical: 5,
      paddingLeft: 10,
    },
    input_size_medium: {
      paddingVertical: 8,
      paddingLeft: 20,
      fontSize: 15,
    },
    input_variant_filled: {
      backgroundColor: t.colors.surface,
      borderRadius: t.borderRadius,
      color: t.colors.typography.primary,
    },
    input_variant_outlined: {
      borderRadius: t.borderRadius,
      borderColor: t.colors.surface,
      borderWidth: 1,
      color: t.colors.typography.primary,
    },
    input_variant_underlined: {
      borderRadius: 0,
      paddingLeft: 0,
      borderBottomColor: t.colors.surface,
      borderBottomWidth: 1,
      color: t.colors.typography.primary,
    },
    input_variant_plain: {
      borderRadius: 0,
      paddingLeft: 0,
    },
    decoration: {
      position: "absolute",
      zIndex: 1,
    },
  });

export default Input;
