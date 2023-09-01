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

export const create = createEvent<Transaction>();
export const transfer = createEvent<{
  from: AccountID;
  to: AccountID;
  amount: Amount;
  additional: Additional;
}>();

export const getAccountTransactions = (
  allTransactions: Transactions,
  account: AccountID
): Transaction[] => {
  return allTransactions[account] ?? [];
};

