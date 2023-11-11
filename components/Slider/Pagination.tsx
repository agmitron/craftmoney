import { Animated, Dimensions, StyleSheet, View } from "react-native";

type Active = boolean;

interface Props {
  pages: Active[];
  scrollX: Animated.Value;
}

const { width } = Dimensions.get("screen");

const Pagination: React.FC<Props> = ({ pages, scrollX }) => {
  console.log({ pages });

  return (
    <View style={styles.root}>
      {pages.map((active, index) => {
        const dotWidth = scrollX.interpolate({
          inputRange: [(index - 1) * width, index * width, (index + 1) * width],
          outputRange: [10, 15, 10],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              active ? styles.dot_active : null,
              { width: dotWidth },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    marginHorizontal: 3,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 3,
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: "gray",
    borderRadius: 5,
  },
  dot_active: {
    backgroundColor: "blue",
  },
});

export default Pagination;
