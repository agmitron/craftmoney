import { ScrollView, StyleSheet } from "react-native";

import AccountsWidget from "~/widgets/accounts";
import Actions from "./Actions";

const HomePage = () => {
  return (
    <ScrollView contentContainerStyle={styles.root}>
      <AccountsWidget />
      <Actions />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "flex-start",
    rowGap: 20,
    backgroundColor: "#f2f4f8", // TODO: theme
    padding: 12,
  },
});

export default HomePage;
