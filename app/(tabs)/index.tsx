import { FlatList, StyleSheet, View } from "react-native";
import { useStore, useStoreMap } from "effector-react";
import Typography from "~/components/Typography";
import Card from "~/components/Card";
import {
  $accounts,
  $transactions,
} from "~/store/index";
import Accounts from "~/components/Accounts";
import List from "~/components/List";

export default function TabOneScreen() {
  const _transactions = useStoreMap($transactions, (transactions) =>
    Object.values(transactions)
      .reduce(
        (accumulator, transactions) => [...accumulator, ...transactions],
        []
      )
      .reverse()
      .filter(({ category }) => category !== "Account creation")
  );

  const _accounts = useStore($accounts);

  return (
    <View style={styles.root}>
      <Accounts />
      <Card style={{ flex: 1, width: "100%" }}>
        <Typography variant="title">Transactions</Typography>
        <FlatList
          data={_transactions}
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
                <Typography>{_accounts[item.account]?.name}</Typography>
              </View>
              <Typography
                style={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {item.difference < 0 ? "-" : "+"}
                {Math.abs(item.difference)} {_accounts[item.account]?.currency}
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
