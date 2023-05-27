import { createEvent, createStore, sample } from "effector";
import {
  $account,
  $additional,
  $amount,
  $category,
  $type,
  addButtonPressed,
} from "./form";

type AccountID = string;
type Additional = Record<string, string>;

interface Transaction {
  difference: number;
  category: string;
  account: AccountID;
}

interface Account {
  id: AccountID;
  currency: string;
  name: string;
}

type Transactions = Record<AccountID, Transaction[]>;
type Balances = Record<AccountID, number>;
type Accounts = Record<AccountID, Account>;

export const $accounts = createStore<Accounts>({});
export const $transactions = createStore<Transactions>({});
export const $balances = $transactions.map((transactions) =>
  Object.fromEntries(
    Object.entries(transactions).map(([account, transactions = []]) => {
      return [
        account,
        transactions.reduce((sum, { difference }) => sum + difference, 0),
      ];
    })
  )
);

export const accountAdded = createEvent<Account>();
export const transactionAdded = createEvent<Transaction>();

export const createAccount = (
  id: string,
  name: string,
  currency: string
): Account => {
  return {
    id,
    currency,
    name,
  };
};

sample({
  clock: accountAdded,
  source: $accounts,
  fn: (accounts, newAccount) => ({ ...accounts, [newAccount.id]: newAccount }),
  target: $accounts,
});

sample({
  clock: accountAdded,
  fn: (account) => ({
    difference: 0,
    category: "Account creation",
    account: account.id,
  }),
  target: transactionAdded,
});

sample({
  clock: transactionAdded,
  source: $transactions,
  fn: (transactions, tx) => {
    const prevTransactions = transactions[tx.account] ?? [];
    return {
      ...transactions,
      [tx.account]: [...prevTransactions, tx],
    };
  },
  target: $transactions,
});

sample({
  clock: addButtonPressed,
  source: {
    amount: $amount,
    category: $category,
    type: $type,
    additional: $additional,
    account: $account,
  },
  fn: ({ additional, amount, category, type, account }) => {
    const difference = type === "income" ? +amount : +amount * -1;

    console.log({ difference, amount });

    return {
      difference,
      category,
      additional,
      account,
    };
  },
  target: transactionAdded,
});
