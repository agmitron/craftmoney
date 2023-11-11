import { ScrollView, StyleSheet } from "react-native";

import AccountsWidget from "~/widgets/accounts";
import TransactionsWidget from "~/widgets/transactions";

export default function Home() {
  return (
    <ScrollView contentContainerStyle={styles.root}>
      <AccountsWidget />
      <TransactionsWidget />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "flex-start",
    rowGap: 20,
  },
});
