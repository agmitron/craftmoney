import { persist } from "@effector-storage/react-native-async-storage";
import { createEvent, createStore } from "effector";

export enum Section {
  Accounts = "accounts",
  Categories = "categories",
}

export type Emoji = {
  [section in Section]: {
    [key: string]: string;
  };
};

export enum AccountsView {
  List,
  Plates,
  Card,
}

export const $emoji = createStore<Emoji>({
  accounts: {},
  categories: {},
});
persist({ key: "$appearance.emoji", store: $emoji });

export const $accounts = createStore<AccountsView>(AccountsView.Plates);
persist({ key: "$appearance.accounts", store: $accounts });

export const setAccounts = createEvent<AccountsView>();

$accounts.on(setAccounts, (_, v) => v);
