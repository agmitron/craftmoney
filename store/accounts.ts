import { persist } from "@effector-storage/react-native-async-storage";
import { Store, combine, createEvent, createStore } from "effector";
import _ from "lodash";

import { SystemCategories } from "./categories";
import * as currencies from "./currencies";
import * as transactions from "./transactions";
import { Account, AccountID, Accounts, Balances } from "./types";

interface Create extends Account {
  emoji: string;
}

export const $accounts = createStore<Accounts>({});
persist({ store: $accounts, key: "$accounts" });
// TODO: simplify
export const $balances: Store<Balances> = combine(
  transactions.$transactions,
  (transactions) => {
    return Object.entries(transactions).reduce<Balances>(
      (balances, [accountID, txs]) => {
        return {
          ...balances,
          [accountID]: txs.reduce<number>((b, { amount }) => {
            return b + amount;
          }, 0),
        };
      },
      {},
    );
  },
);

export const $totalBalance = combine(
  $balances,
  currencies.$rates,
  $accounts,
  (balances, rates, accounts) => {
    if (!rates) {
      return 0;
    }

    return Object.values(accounts).reduce<number>((total, account) => {
      const balance = balances[account.id];
      const rate = rates[account.currency];
      return total + balance / rate;
    }, 0);
  },
);

export const create = createEvent<Create>();
export const remove = createEvent<AccountID>();
export const reset = createEvent();
export const update = createEvent<{
  id: AccountID;
  upd: Partial<Account>;
}>();

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
