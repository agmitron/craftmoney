import { PropsWithChildren } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { assertStyle } from "../shared/utils/style";

interface Props {
  style?: StyleProp<ViewStyle>;
}

const Card: React.FC<PropsWithChildren<Props>> = ({ children, style }) => {
  return <View style={[styles.root, assertStyle(style)]}>{children}</View>;
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
});

export default Card;
