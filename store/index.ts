import { createEvent, createStore, sample } from "effector";
import { persist } from "@effector-storage/react-native-async-storage";
import * as form from "./form";

type AccountID = string;

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

persist({ store: $accounts });
persist({ store: $transactions });

export const $balances = $transactions.map<Balances>((transactions) =>
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
  clock: form.addButtonPressed,
  source: {
    amount: form.$amount,
    category: form.$category,
    type: form.$type,
    additional: form.$additional,
    account: form.$account,
  },
  fn: ({ additional, amount, category, type, account }) => {
    const difference = type === "income" ? +amount : +amount * -1;

    return {
      difference,
      category,
      additional,
      account,
    };
  },
  target: transactionAdded,
});

// TODO: remove
const testAccount1 = createAccount("0", "THB", "THB");
const testAccount2 = createAccount("1", "IDR", "IDR");
const testAccount3 = createAccount("2", "USD", "USD");

accountAdded(testAccount1);
accountAdded(testAccount2);
accountAdded(testAccount3);
