import { FlatList, StyleSheet, View } from "react-native";
import { useStore, useStoreMap } from "effector-react";
import Typography from "~/components/Typography";
import Card from "~/components/Card";
import {
  $accounts,
  $transactions,
  accountAdded,
  createAccount,
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

export default function TabOneScreen() {
  const transactions = useStoreMap($transactions, (transactions) =>
    Object.values(transactions)
      .reduce(
        (accumulator, transactions) => [...accumulator, ...transactions],
        []
      )
      .reverse()
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
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  rowGap: 5,
                  justifyContent: "center",
                }}
              >
                <Typography variant="subtitle">{item.category}</Typography>
                <Typography>{accounts[item.account].name}</Typography>
              </View>
              <Typography
                style={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {item.difference < 0 ? "-" : "+"}
                {Math.abs(item.difference)} {accounts[item.account].currency}
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
