import _ from "lodash";
import { createEvent, createStore } from "effector";
import { persist } from "@effector-storage/react-native-async-storage";
import { Account, AccountID, Accounts, Balances } from "./types";

export const $accounts = createStore<Accounts>({});
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
