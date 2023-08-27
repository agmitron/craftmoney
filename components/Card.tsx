import { PropsWithChildren } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { assertStyle } from "../utils/style";

interface Props {
  style?: StyleProp<ViewStyle>;
}

const Card: React.FC<PropsWithChildren<Props>> = ({ children, style }) => {
  return (
    <View style={{ ...styles.root, ...assertStyle(style) }}>{children}</View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 28,
  },
});

export default Card;
