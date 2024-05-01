import { useStore, useStoreMap } from "effector-react";
import { StyleSheet, View } from "react-native";

import Card from "~/components/Card";
import Typography from "~/components/Typography";
import { accounts, appearance, transactions } from "~/entities";
import { Category } from "~/entities/types";

const TransactionsWidget = () => {
  const allTransactions = useStore(transactions.$allTransactions);
  const emoji = useStoreMap(
    appearance.Emoji.$emoji,
    ({ categories }) => categories,
  );
  const _accounts = useStore(accounts.$accounts);

  const cutCategory = (c: Category) => {
    return c.split(".").pop();
  };

  return (
    <View style={styles.root}>
      <Typography variant="title">Transactions</Typography>
      {allTransactions.map(
        ({ account, amount, category, id, additional }, key) => (
          <Card key={key} style={styles.transaction}>
            <View style={styles.transaction__icon}>
              <Typography style={{ fontSize: 30 }}>
                {emoji[category] ?? "⏳"}
              </Typography>
            </View>
            <View style={styles.transaction__left}>
              <Typography variant="subtitle">
                {cutCategory(category)}
              </Typography>
              <Typography variant="text">{_accounts[account].name}</Typography>
            </View>
            <View style={styles.transaction__right}>
              <Typography variant="title">
                {amount} {_accounts[account].currency}
              </Typography>
              <Typography variant="text">
                {new Date(additional.timestamp).toDateString()}
              </Typography>
            </View>
          </Card>
        ),
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
    rowGap: 10,
    padding: 5,
  },
  transaction: {
    flexDirection: "row",
  },
  transaction__icon: {
    justifyContent: "center",
  },
  transaction__left: {
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginLeft: 10,
  },
  transaction__right: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginRight: 0,
    marginLeft: "auto",
  },
});

export default TransactionsWidget;
