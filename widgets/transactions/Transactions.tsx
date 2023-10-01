import { useStore, useStoreMap } from "effector-react";
import { StyleSheet, View } from "react-native";

import Card from "~/components/Card";
import Typography from "~/components/Typography";
import { accounts, appearance, transactions } from "~/store";

const TransactionsWidget = () => {
  const allTransactions = useStore(transactions.$allTransactions);
  const emoji = useStoreMap(
    appearance.Emoji.$emoji,
    ({ categories }) => categories
  );
  const _accounts = useStore(accounts.$accounts);
  return (
    <View style={styles.root}>
      {allTransactions.map(({ account, amount, category, id, additional }) => (
        <Card key={id} style={styles.transaction}>
          <View style={styles.transaction__icon}>
            <Typography style={{ fontSize: 30 }}>
              {emoji[category] ?? "⏳"}
            </Typography>
          </View>
          <View style={styles.transaction__left}>
            <Typography variant="subtitle">{category}</Typography>
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
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
    rowGap: 10,
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
