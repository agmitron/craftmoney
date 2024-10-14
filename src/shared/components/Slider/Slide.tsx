import { Dimensions, StyleSheet, View } from "react-native";

interface Props {
  page: React.ReactNode;
}

const { width, height } = Dimensions.get("screen");

const Slide: React.FC<Props> = ({ page }) => {
  return <View style={styles.root}>{page}</View>;
};

const styles = StyleSheet.create({
  root: {
    width,
    height,
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
  image: {
    width: "100%",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 18,
    marginVertical: 12,
    color: "#333",
  },
  icon: {
    fontSize: 32,
    fontWeight: "bold",
    color: "black",
  },
});

export default Slide;
