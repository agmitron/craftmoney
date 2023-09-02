import { Link, useNavigation } from "@react-navigation/native";
import { useStore, useStoreMap } from "effector-react";
import { StyleSheet, View } from "react-native";

import { Screens } from "~/app/_layout";
import Button from "~/components/Button";
import Card from "~/components/Card";
import Typography from "~/components/Typography";
import { accounts, transactions } from "~/store";

export default function TabOneScreen() {
  const _accounts = useStore(accounts.$accounts);
  const _balances = useStore(accounts.$balances);
  const allTransactions = useStoreMap(
    transactions.$transactions,
    (transactions) => {
      return Object.values(transactions).flat();
    }
  );

  const { navigate } = useNavigation();

  return (
    <View style={styles.root}>
      <View style={styles.accounts}>
        {Object.values(_accounts).map((account) => (
          <Card style={styles.account}>
            <Typography variant="title">{account.name}</Typography>
            <Typography variant="subtitle">
              {_balances[account.id]} {account.currency}
            </Typography>
          </Card>
        ))}
        <Card style={styles.account_create}>
          <Typography variant="title">Create a new account</Typography>
          <Button
            variant="contained"
            style={{ width: "100%" }}
            onPress={() => navigate(Screens.AccountsCreate as never)}
          >
            +
          </Button>
        </Card>
      </View>

      <View style={styles.transactions}>
        {allTransactions.map(({ account, amount, category }) => (
          <Card>
            <Typography variant="title">{category}</Typography>
            <Typography variant="subtitle">
              {_accounts[account].name}
            </Typography>
            <Typography variant="text">{amount}</Typography>
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
  account: {},
  account_create: {
    rowGap: 20,
  },
  transactions: {},
});
