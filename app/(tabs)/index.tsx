import { useStore, useStoreMap } from "effector-react";
import { StyleSheet, View } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";

import AccountsWidget from "~/components/AccountsWidget";
import Button from "~/components/Button";
import Card from "~/components/Card";
import Typography from "~/components/Typography";
import { accounts, transactions } from "~/store";

export default function TabOneScreen() {
  const _accounts = useStore(accounts.$accounts);
  const allTransactions = useStoreMap(
    transactions.$transactions,
    (transactions) => Object.values(transactions).flat()
  );

  return (
    <View style={styles.root}>
      <View style={styles.accounts}>
        <AccountsWidget />
      </View>

      <View style={styles.transactions}>
        {allTransactions.map((tx) => (
          <Swipeable
            key={tx.id}
            renderRightActions={() => (
              <Button onPress={() => transactions.remove(tx)}>Delete</Button>
            )}
          >
            <Card>
              <Typography variant="title">{tx.category}</Typography>
              <Typography variant="subtitle">
                {_accounts[tx.account].name}
              </Typography>
              <Typography variant="text">{tx.amount}</Typography>
            </Card>
          </Swipeable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  accounts: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    width: "100%",
  },
  transactions: {},
});
