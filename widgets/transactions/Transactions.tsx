import { useStore, useStoreMap } from "effector-react";
import { StyleSheet, View } from "react-native";

import Card from "~/components/Card";
import Swipeable from "~/components/Swipeable";
import Typography from "~/components/Typography";
import { accounts, appearance, transactions } from "~/store";
import { Category } from "~/store/types";

interface TransactionProps {
  emoji: string;
  category: string;
  account: string;
  amount: number;
  currency: string;
  date: string;
}

const Transaction: React.FC<TransactionProps> = ({
  emoji,
  category,
  account,
  amount,
  currency,
  date,
}) => {
  return (
    <Card style={styles.transaction}>
      <View style={styles.transaction__icon}>
        <Typography style={{ fontSize: 30 }}>{emoji}</Typography>
      </View>
      <View style={styles.transaction__left}>
        <Typography variant="subtitle">{category}</Typography>
        <Typography variant="text">{account}</Typography>
      </View>
      <View style={styles.transaction__right}>
        <Typography variant="title">
          {amount} {currency}
        </Typography>
        <Typography variant="text">{date}</Typography>
      </View>
    </Card>
  );
};

const TransactionsWidget = () => {
  const allTransactions = useStore(transactions.$allTransactions);
  const emoji = useStoreMap(
    appearance.Emoji.$emoji,
    ({ categories }) => categories
  );
  const _accounts = useStore(accounts.$accounts);

  const cutCategory = (c: Category) => {
    return c.split(".").pop() ?? c;
  };

  return (
    <View style={styles.root}>
      <Typography variant="title">Transactions</Typography>
      {allTransactions.map(
        ({ account, amount, category, id, additional }, key) => (
          <Swipeable onDelete={() => console.log("onDelete")}>
            <Transaction
              emoji={emoji[category] ?? "⏳"}
              category={cutCategory(category)}
              account={_accounts[account].name}
              amount={amount}
              currency={_accounts[account].currency}
              date={new Date(additional.timestamp).toDateString()}
            />
          </Swipeable>
        )
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
