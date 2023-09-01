import { Store, createEvent, createStore, sample } from "effector";

import { transactions } from "./index";
import {
  Account,
  Additional,
  Category,
  Difference,
  Transaction,
} from "./types";

import { NonNullableStructure } from "~/utils/nullable";
import {
  Errors,
  Failed,
  Results,
  Rules,
  isFailed,
  isSuccessful,
  preparedRules,
} from "~/utils/validation";

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
  account: preparedRules.notNull,
  additional: preparedRules.pass,
  category: preparedRules.notNull,
  difference: (value) => !isNaN(value),
  type: preparedRules.notNull,
};

export const errorsMessages = {
  account: "Required",
  additional: "",
  category: "Required",
  difference: "Must be numeric",
  type: "Required",
};

export const $validationResults = createStore<Results<Form>>({
  account: false,
  additional: false,
  category: false,
  difference: false,
  type: false,
});

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
export const reset = createEvent();

$category.on(selectCategory, (_, category) => category).reset(reset);
$account.on(selectAccount, (_, account) => account).reset(reset);
$type.on(selectType, (_, type) => type).reset(reset);
$difference.on(setDifference, (_, difference) => +difference).reset(reset);
$additional
  .on(setAdditional, (prev, current) => ({ ...prev, ...current }))
  .reset(reset);

const source = {
  category: $category,
  account: $account,
  difference: $difference,
  type: $type,
  additional: $additional,
};

sample({
  clock: [submit, $account, $additional, $type, $category, $difference],
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
  target: $validationResults,
});

// Create a transaction otherwise
sample({
  clock: $validationResults,
  source,
  filter: (source, clock): source is NonNullableStructure<Form> =>
    isSuccessful(clock),
  fn: ({
    account,
    category,
    difference,
    type,
    additional,
  }: NonNullableStructure<Form>): Transaction => {
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
