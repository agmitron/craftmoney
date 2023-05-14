import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

interface Props {}

const Card: React.FC<PropsWithChildren<Props>> = ({ children }) => {
  return <View style={styles.root}>{children}</View>;
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
