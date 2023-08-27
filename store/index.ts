import { sample } from "effector";
import _ from "lodash";

import * as accounts from "./accounts";
import * as categories from "./categories";
import * as transactions from "./transactions";

sample({
  clock: accounts.create,
  source: accounts.$accounts,
  fn: (previousAccounts, newAccount) => {
    const id = accounts.generateAccountID(previousAccounts);
    return {
      ...previousAccounts,
      [id]: {
        ...newAccount,
        id,
      },
    };
  },
  target: accounts.$accounts,
});

sample({
  clock: accounts.remove,
  source: accounts.$accounts,
  fn: (accounts, id) => _.omit(accounts, id),
  target: accounts.$accounts,
});

sample({
  clock: accounts.update,
  source: accounts.$accounts,
  fn: (accounts, { id, account }) => {
    const previousAccount = accounts[id];
    const newAccount = { ...previousAccount, ...account };
    return { ...accounts, [id]: newAccount };
  },
  target: accounts.$accounts,
});

sample({
  clock: accounts.create,
  source: { balances: accounts.$balances, accounts: accounts.$accounts },
  fn: ({ balances, accounts }) =>
    Object.keys(accounts).reduce(
      (accumulator, accountID) => ({
        ...accumulator,
        [accountID]: balances[accountID] ?? 0,
      }),
      {},
    ),
  target: accounts.$balances,
});

sample({
  clock: transactions.create,
  source: accounts.$balances,
  fn: (balances, transaction) => {
    const previousBalance = balances[transaction.account];
    const newBalance = previousBalance + transaction.difference;
    return { ...balances, [transaction.account]: newBalance };
  },
  target: accounts.$balances,
});

sample({
  clock: transactions.create,
  source: transactions.$transactions,
  fn: (transactions, newTransaction) => {
    const previousTransactions = transactions?.[newTransaction.account] ?? [];
    const newTransactions = [...previousTransactions, newTransaction];

    return {
      ...transactions,
      [newTransaction.account]: newTransactions,
    };
  },
  target: transactions.$transactions,
});

export { accounts, transactions, categories };
