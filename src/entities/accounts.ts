import { persist } from "@effector-storage/react-native-async-storage";
import { Store, combine, createEvent, createStore } from "effector";
import _ from "lodash";

import * as currencies from "./currencies";
import * as transactions from "./transactions";
import { Account, AccountID, Accounts, Balances } from "./types";

interface Create extends Account {
  emoji: string;
}

// TODO:
const testAccountID = "test-account-id";
const testAccount: Account = {
  id: testAccountID,
  currency: "USD",
  name: "Test Account",
};

export const $accounts = createStore<Accounts>({
  [testAccountID]: testAccount,
});
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
      {}
    );
  }
);

export const $totalBalance = combine(
  $balances,
  currencies.$rates,
  $accounts,
  (balances, rates, accounts) => {
    return Object.values(accounts).reduce<number>((total, account) => {
      const balance = balances[account.id];
      const rate = rates?.[account.currency] ?? 1;
      return total + balance / rate;
    }, 0);
  }
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
