import { StyleSheet, View } from "react-native";
import Typography from "../../components/Typography";
import { useStore, useStoreMap } from "effector-react";
import { accounts, transactions } from "../../store";
import Card from "../../components/Card";

export default function TabOneScreen() {
  const _accounts = useStore(accounts.$accounts);
  const _balances = useStore(accounts.$balances);
  const allTransactions = useStoreMap(transactions.$transactions, (transactions) => {
    return Object.values(transactions).flat();
  });

  return (
    <View style={styles.root}>
      <View style={styles.accounts}>
        {Object.values(_accounts).map((account) => (
          <Card>
            <Typography variant="title">{account.name}</Typography>
            <Typography variant="subtitle">
              {_balances[account.id]} {account.currency}
            </Typography>
          </Card>
        ))}
      </View>

      <View style={styles.transactions}>
        {allTransactions.map(({ account, difference, type }) => (
          <Card>
            <Typography variant="title">{type}</Typography>
            <Typography variant="subtitle">{_accounts[account].name}</Typography>
            <Typography variant="text">{difference}</Typography>
          </Card>
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
  },
  transactions: {}
});
