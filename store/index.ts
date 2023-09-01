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
      {}
    ),
  target: accounts.$balances,
});

sample({
  clock: transactions.create,
  source: accounts.$balances,
  fn: (balances, transaction) => {
    const previousBalance = balances[transaction.account];
    const newBalance = previousBalance + transaction.amount;
    return { ...balances, [transaction.account]: newBalance };
  },
  target: accounts.$balances,
});

sample({
  clock: transactions.create,
  source: transactions.$transactions,
  fn: (previous, tx) => {
    const newTransactions = [
      ...transactions.getAccountTransactions(previous, tx.account),
      tx,
    ];

    return {
      ...previous,
      [tx.account]: newTransactions,
    };
  },
  target: transactions.$transactions,
});

sample({
  clock: transactions.transfer,
  source: transactions.$transactions,
  fn: (previous, tx) => {
    return {
      ...previous,
      [tx.from]: [
        ...transactions.getAccountTransactions(previous, tx.from),
        {
          account: tx.from,
          additional: tx.additional,
          amount: tx.amount * -1,
          category: categories.SystemCategories.Transfer,
        },
      ],
      [tx.to]: [
        ...transactions.getAccountTransactions(previous, tx.to),
        {
          account: tx.to,
          additional: tx.additional,
          amount: tx.amount,
          category: categories.SystemCategories.Transfer,
        },
      ],
    };
  },
  target: transactions.$transactions,
});

export { accounts, transactions, categories };
