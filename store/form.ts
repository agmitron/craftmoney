import { createEvent, createStore, sample } from "effector";
import { Account, Transaction } from "./types";
import { transactions } from "./index";

export enum TransactionType {
  Transfer,
  Income,
  Expense,
}

interface Submit {
  type: TransactionType;
  account: Account;
  category: string;
  difference: string;
}

export const $category = createStore<string | null>(null);
export const $account = createStore<Account | null>(null);
export const $difference = createStore("");
export const $type = createStore<TransactionType>(TransactionType.Expense);

export const selectCategory = createEvent<string>();
export const selectAccount = createEvent<Account>();
export const setDifference = createEvent<string>();
export const selectType = createEvent<TransactionType>();
export const submit = createEvent();

$category.on(selectCategory, (_, category) => category);
$account.on(selectAccount, (_, account) => account);
$type.on(selectType, (_, type) => type);
$difference.on(setDifference, (_, difference) => difference);

sample({
  clock: submit,
  source: {
    category: $category,
    account: $account,
    difference: $difference,
    type: $type,
  },
  filter: (source): source is Submit =>
    source.type !== TransactionType.Transfer &&
    source.account !== null &&
    source.category !== null,
  fn: ({ account, category, difference, type }: Submit): Transaction => {
    switch (type) {
      case TransactionType.Expense: {
        return {
          account: account.id,
          difference: Number(difference) * -1, // TODO: validation
          category,
        };
      }
      case TransactionType.Income: {
        return {
          difference: Number(difference), // TODO: validation
          account: account.id,
          category,
        };
      }
      default: {
        throw new Error(`Unhandled transaction type: ${type}`);
      }
    }
  },
  target: transactions.create,
});
