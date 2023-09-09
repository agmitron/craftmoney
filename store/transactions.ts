import { persist } from "@effector-storage/react-native-async-storage";
import { createEvent, createStore } from "effector";

import {
  AccountID,
  Additional,
  Amount,
  Transaction,
  Transactions,
} from "./types";

export const $transactions = createStore<Transactions>({});
persist({ store: $transactions, key: "$transactions" });

export const create = createEvent<Omit<Transaction, "id">>();
export const transfer = createEvent<{
  from: AccountID;
  to: AccountID;
  amount: Amount;
  additional: Additional;
}>();
export const remove = createEvent<Pick<Transaction, "id" | "account">>();
export const reset = createEvent();

export const getAccountTransactions = (
  allTransactions: Transactions,
  account: AccountID
): Transaction[] => {
  return allTransactions[account] ?? [];
};

$transactions.reset(reset);

$transactions.on(remove, (previous, tx) => ({
  ...previous,
  [tx.account]: previous[tx.account]?.filter(({ id }) => id !== tx.id) ?? [],
}));
