import { FlatList, StyleSheet, View } from "react-native";
import { useStore, useStoreMap } from "effector-react";
import Typography from "~/components/Typography";
import Card from "~/components/Card";
import {
  $accounts,
  $transactions,
  accountAdded,
  createAccount,
  transactionAdded,
} from "~/store/index";
import Accounts from "~/components/Accounts";
import List from "~/components/List";

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

  return (
    <View style={styles.root}>
      <Accounts />
      <Card style={{ flex: 1, width: "100%" }}>
        <Typography variant="title">Transactions</Typography>
        <FlatList
          data={transactions}
          renderItem={({ item }) => (
            <List.Item
              // TODO: refactor
              style={{
                flexDirection: "row",
                columnGap: 50,
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  rowGap: 5,
                  justifyContent: "center",
                }}
              >
                <Typography variant="subtitle">{item.type}</Typography>
                <Typography>{accounts[item.account].name}</Typography>
              </View>
              <Typography
                style={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {item.difference} {accounts[item.account].currency}
              </Typography>
            </List.Item>
          )}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    alignContent: "space-between",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    rowGap: 20,
    flex: 1,
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
