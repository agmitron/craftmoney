import { createEvent, createStore, sample } from "effector";

import { transactions } from "./index";
import {
  Account,
  Additional,
  Category,
  Difference,
  Transaction,
} from "./types";

import { Results, Rules, isFailed, isSuccessful } from "~/utils/validation";

export enum TransactionType {
  Transfer,
  Income,
  Expense,
}

interface Form {
  type: TransactionType;
  account: Account | null;
  category: Category | null;
  difference: Difference;
  additional: Additional;
}

const rules: Rules<Form> = {
  account: (value) => value !== null,
  additional: () => true,
  category: (value) => value !== null,
  difference: (value) => !isNaN(value),
  type: () => true,
};

export const $category = createStore<Category | null>(null);
export const $account = createStore<Account | null>(null);
export const $difference = createStore<Difference>(0);
export const $type = createStore<TransactionType>(TransactionType.Expense);
export const $additional = createStore<Additional>({ timestamp: Date.now() });

export const selectCategory = createEvent<string>();
export const selectAccount = createEvent<Account>();
export const setDifference = createEvent<string>();
export const selectType = createEvent<TransactionType>();
export const setAdditional = createEvent<Omit<Additional, "timestamp">>();
export const validated = createEvent<Results<Form>>();
export const submit = createEvent();

$category.on(selectCategory, (_, category) => category);
$account.on(selectAccount, (_, account) => account);
$type.on(selectType, (_, type) => type);
$difference.on(setDifference, (_, difference) => +difference);
$additional.on(setAdditional, (prev, current) => ({ ...prev, ...current }));

const source = {
  category: $category,
  account: $account,
  difference: $difference,
  type: $type,
  additional: $additional,
};

sample({
  clock: submit,
  source,
  fn: (form) => ({
    // TODO: type-safe loop
    account: rules.account(form.account),
    additional: rules.additional(form.additional),
    category: rules.category(form.category),
    difference: rules.difference(form.difference),
    type: rules.type(form.type),
  }),
  target: validated,
});

// Show error if failed
sample({
  clock: validated,
  source,
  filter: (_, clock) => isFailed(clock),
  fn: () => {},
});

// Create a transaction otherwise
sample({
  clock: validated,
  source,
  filter: (_, clock) => isSuccessful(clock),
  fn: ({ account, category, difference, type, additional }): Transaction => {
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
