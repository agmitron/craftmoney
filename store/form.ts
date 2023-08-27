import { createEvent, createStore, sample } from "effector";
import { Account, Additional, Transaction } from "./types";
import { transactions } from "./index";

export enum TransactionType {
  Transfer,
  Income,
  Expense,
}

interface Form {
  type: TransactionType;
  account: Account;
  category: string;
  difference: string;
  additional: Additional;
}

export const $category = createStore<string | null>(null);
export const $account = createStore<Account | null>(null);
export const $difference = createStore("");
export const $type = createStore<TransactionType>(TransactionType.Expense);
export const $additional = createStore<Additional>({ timestamp: Date.now() });

export const selectCategory = createEvent<string>();
export const selectAccount = createEvent<Account>();
export const setDifference = createEvent<string>();
export const selectType = createEvent<TransactionType>();
export const setAdditional = createEvent<Omit<Additional, "timestamp">>();
export const submit = createEvent();

$category.on(selectCategory, (_, category) => category);
$account.on(selectAccount, (_, account) => account);
$type.on(selectType, (_, type) => type);
$difference.on(setDifference, (_, difference) => difference);
$additional.on(setAdditional, (prev, current) => ({ ...prev, ...current }));

sample({
  clock: submit,
  source: {
    category: $category,
    account: $account,
    difference: $difference,
    type: $type,
    additional: $additional,
  },
  filter: (source): source is Form =>
    source.type !== TransactionType.Transfer &&
    source.account !== null &&
    source.category !== null,
  fn: ({
    account,
    category,
    difference,
    type,
    additional,
  }: Form): Transaction => {
    const transaction: Transaction = {
      account: account.id,
      difference: Number(difference), // TODO: validation
      category,
      additional,
    };

    switch (type) {
      case TransactionType.Expense: {
        transaction.difference = transaction.difference * -1;
        return transaction;
      }
      case TransactionType.Income: {
        return transaction;
      }
      default: {
        throw new Error(`Unhandled transaction type: ${type}`);
      }
    }
  },
  target: transactions.create,
});
