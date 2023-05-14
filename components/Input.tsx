import { ReactNode } from "react";
import { TextInput, StyleSheet, View, TextInputProps } from "react-native";
import { useTheme } from "./Themed";

interface Props extends TextInputProps {
  placeholder?: string;
  decorations?: {
    left?: ReactNode;
    right?: ReactNode;
  };
}

const Input: React.FC<Props> = ({ decorations, style, ...props }) => {
  const theme = useTheme();

  return (
    <View
      style={{ ...styles.root, ...(typeof style === "object" ? style : {}) }}
    >
      <View style={{ ...styles.decoration, left: 0 }}>
        {decorations?.left && decorations.left}
      </View>
      <TextInput
        style={{
          ...styles.input,
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius,
          color: theme.colors.typography.primary,
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

const styles = StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    width: "100%"
  },
  input: {
    paddingVertical: 16,
    paddingLeft: 41,
    borderRadius: 10,
    width: "100%",
    fontSize: 20,
  },
  decoration: {
    position: "absolute",
    zIndex: 1
  },
});

export default Input;
