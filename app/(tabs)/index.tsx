import { useStore, useStoreMap } from "effector-react";
import { ScrollView, StyleSheet, View } from "react-native";
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
      <ScrollView>
        <View style={styles.accounts}>
          <AccountsWidget />
        </View>

        <View style={styles.transactions}>
          <Typography variant="title">Transactions</Typography>
          {allTransactions.map((tx) => (
            <View style={{ width: "100%" }}>
              <Swipeable
                key={tx.id}
                renderRightActions={() => (
                  <Button onPress={() => transactions.remove(tx)}>
                    Delete
                  </Button>
                )}
              >
                <Card
                  // TODO: refactor styles
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 20,
                  }}
                >
                  <View style={{ rowGap: 5 }}>
                    <Typography variant="title">{tx.category}</Typography>
                    <Typography variant="subtitle">
                      {_accounts[tx.account].name}
                    </Typography>
                  </View>
                  <View style={{ rowGap: 5 }}>
                    <Typography variant="title" align="right">
                      {tx.amount} {_accounts[tx.account].currency}
                    </Typography>
                    <Typography variant="subtitle" align="right">
                      {new Date(tx.additional.timestamp).toLocaleDateString()}
                    </Typography>
                  </View>
                </Card>
              </Swipeable>
            </View>
          ))}
        </View>
      </ScrollView>
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
  transactions: {
    width: "100%",
    rowGap: 20,
    marginTop: 20
  },
});
