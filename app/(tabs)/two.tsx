import { StyleSheet, View } from "react-native";

import Typography from "../../components/Typography";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Typography>Tab two</Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
