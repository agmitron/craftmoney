import _ from "lodash";
import { createEvent, createStore } from "effector";
import { Account, AccountID, Accounts, Balances } from "./types";

export const $accounts = createStore<Accounts>({});
export const $balances = createStore<Balances>({});

export const create = createEvent<Omit<Account, "id">>();
export const remove = createEvent<AccountID>();
export const update = createEvent<{
  id: AccountID;
  account: Partial<Account>;
}>();

export const generateAccountID = (accounts: Accounts) => _.size(accounts);
