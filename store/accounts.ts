import { persist } from "@effector-storage/react-native-async-storage";
import { createEvent, createStore } from "effector";
import _ from "lodash";

import { Account, AccountID, Accounts, Balances } from "./types";

export const $accounts = createStore<Accounts>({
  0: { currency: "THB", name: "THB", id: "0" },
  1: { currency: "USD", name: "USD", id: "1" },
  2: { currency: "RUB", name: "RUB", id: "2" },
});
persist({ store: $accounts, key: "$accounts" });
export const $balances = createStore<Balances>({});
persist({ store: $balances, key: "$balances" });

export const create = createEvent<Omit<Account, "id">>();
export const remove = createEvent<AccountID>();
export const reset = createEvent();
export const update = createEvent<{
  id: AccountID;
  account: Partial<Account>;
}>();

export const generateAccountID = (accounts: Accounts): AccountID =>
  _.size(accounts).toString();

$accounts.reset(reset);
