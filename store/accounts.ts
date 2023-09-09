import { persist } from "@effector-storage/react-native-async-storage";
import { createEvent, createStore } from "effector";
import _ from "lodash";

import { Account, AccountID, Accounts, Balances } from "./types";

interface Create extends Account {
  emoji: string;
}

export const $accounts = createStore<Accounts>({});
persist({ store: $accounts, key: "$accounts" });
export const $balances = createStore<Balances>({});
persist({ store: $balances, key: "$balances" });

export const create = createEvent<Create>();
export const remove = createEvent<AccountID>();
export const reset = createEvent();
export const update = createEvent<{
  id: AccountID;
  upd: Partial<Account>;
}>();

export const generateAccountID = (accounts: Accounts): AccountID =>
  _.size(accounts).toString();

$accounts.reset(reset);

$accounts.on(update, (accounts, { id, upd }) => {
  const previousAccount = accounts[id];
  return {
    ...accounts,
    [id]: {
      ...previousAccount,
      ...upd,
    },
  };
});

$accounts.on(remove, (accounts, id) => _.omit(accounts, id));
