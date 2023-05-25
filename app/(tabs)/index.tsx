import { FlatList, StyleSheet, View } from "react-native";
import { useStore, useStoreMap } from "effector-react";
import Typography from "~/components/Typography";
import {
  $accounts,
  $balances,
  $transactions,
  accountAdded,
  createAccount,
  transactionAdded,
} from "~/store/index";

// TODO: remove
const testAccount1 = createAccount("0", "THB", "THB");
const testAccount2 = createAccount("1", "IDR", "IDR");
const testAccount3 = createAccount("2", "USD", "USD");

accountAdded(testAccount1);
accountAdded(testAccount2);
accountAdded(testAccount3);

transactionAdded({
  difference: -100,
  type: "Public transport",
  account: testAccount1.id,
});
transactionAdded({
  difference: -150,
  type: "Groceries",
  account: testAccount1.id,
});
transactionAdded({
  difference: -50,
  type: "Restaurants",
  account: testAccount1.id,
});

transactionAdded({
  difference: -2000,
  type: "Maintainance, repairs",
  account: testAccount2.id,
});
transactionAdded({
  difference: -2600,
  type: "Taxes",
  account: testAccount2.id,
});
transactionAdded({
  difference: +4800,
  type: "Wage, invoices",
  account: testAccount2.id,
});

transactionAdded({
  difference: -25,
  type: "Restaurants",
  account: testAccount3.id,
});
transactionAdded({
  difference: -30,
  type: "Investments",
  account: testAccount3.id,
});
transactionAdded({
  difference: -17,
  type: "Restaurants",
  account: testAccount3.id,
});

export default function TabOneScreen() {
  const transactions = useStoreMap($transactions, (transactions) =>
    Object.values(transactions).reduce(
      (accumulator, transactions) => [...accumulator, ...transactions],
      []
    )
  );
  const accounts = useStore($accounts);
  const balances = useStore($balances);

  return (
    <View style={styles.container}>
      <Typography variant="title">Accounts</Typography>
      <FlatList
        data={accounts}
        renderItem={({ item: { id, name, currency } }) => (
          <View
            style={{
              flexDirection: "row",
              columnGap: 50,
              justifyContent: "space-between",
            }}
          >
            <Typography>Name: {name}</Typography>
            <Typography>Currency: {currency}</Typography>
            <Typography>Balance: {balances[id]}</Typography>
          </View>
        )}
      />

      <Typography variant="title">Transactions</Typography>
      <FlatList
        data={transactions}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              columnGap: 50,
              justifyContent: "space-between",
            }}
          >
            <Typography>Type: {item.type}</Typography>
            <Typography>Difference: {item.difference}</Typography>
            <Typography>Account: {item.account}</Typography>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
});
