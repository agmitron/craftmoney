import {
  StoreValue,
  combine,
  createEvent,
  createStore,
  sample,
} from "effector";

import { transactions } from "../index";
import { Account, Additional, Category, Transaction } from "../types";

import { NonNullableStructure } from "~/utils/nullable";
import {
  Results,
  Rules,
  isSuccessful,
  preparedRules,
} from "~/utils/validation";

export enum TransactionType {
  Transfer,
  Income,
  Expense,
}

export const $type = createStore<TransactionType>(TransactionType.Expense);
export const selectType = createEvent<TransactionType>();
$type.on(selectType, (_, type) => type);

function createIncomeExpenseForm() {
  interface Form {
    account: Account | null;
    category: Category | null;
    amount: string;
    additional: Additional;
  }

  const rules: Rules<Form> = {
    account: preparedRules.notNull,
    additional: preparedRules.pass,
    category: preparedRules.notNull,
    amount: (value) => value !== "" && !isNaN(+value),
  };

  const errorsMessages = {
    account: "Required",
    additional: "",
    category: "Required",
    amount: "Required, must be numeric",
  };

  const $validationResults = createStore<Results<Form>>({
    account: false,
    additional: false,
    category: false,
    amount: false,
  });

  const $category = createStore<Category | null>(null);
  const $account = createStore<Account | null>(null);
  const $amount = createStore<string>("");
  const $additional = createStore<Additional>({ timestamp: Date.now() });

  const selectCategory = createEvent<string>();
  const selectAccount = createEvent<Account>();
  const setAmount = createEvent<string>();

  const setAdditional = createEvent<Omit<Additional, "timestamp">>();
  const validated = createEvent<Results<Form>>();
  const submit = createEvent();
  const reset = createEvent();

  $category.on(selectCategory, (_, category) => category).reset(reset);
  $account.on(selectAccount, (_, account) => account).reset(reset);

  $amount.on(setAmount, (_, amount) => amount).reset(reset);
  $additional
    .on(setAdditional, (prev, current) => ({ ...prev, ...current }))
    .reset(reset);

  $validationResults.on(validated, (_, results) => results);

  const source = combine({
    category: $category,
    account: $account,
    amount: $amount,
    type: $type,
    additional: $additional,
  });

  type Source = StoreValue<typeof source>;

  sample({
    clock: [submit, $account, $additional, $type, $category, $amount],
    source,
    fn: (form) => ({
      // TODO: type-safe loop
      account: rules.account(form.account),
      additional: rules.additional(form.additional),
      category: rules.category(form.category),
      amount: rules.amount(form.amount),
    }),
    target: validated,
  });

  // Create a transaction otherwise
  sample({
    clock: $validationResults,
    source,
    filter: (source, clock): source is NonNullableStructure<Source> =>
      isSuccessful(clock) && source.type !== TransactionType.Transfer,
    fn: (form: NonNullableStructure<Source>): Transaction => {
      const transaction: Transaction = {
        account: form.account.id,
        amount: Number(form.amount),
        category: form.category,
        additional: form.additional,
      };

      switch (form.type) {
        case TransactionType.Expense: {
          transaction.amount = transaction.amount * -1;
          return transaction;
        }
        case TransactionType.Income: {
          return transaction;
        }
        default: {
          throw new Error(`Unhandled transaction type: ${form.type}`);
        }
      }
    },
    target: transactions.create,
  });

  // If the transfer type is chosen
  sample({
    clock: $validationResults,
    source,
    filter: (source, clock): source is NonNullableStructure<Source> =>
      isSuccessful(clock) && source.type === TransactionType.Transfer,
    fn: (form: NonNullableStructure<Source>): Transaction => {
      return {
        account: form.account.id,
        amount: Number(form.amount),
        category: form.category,
        additional: form.additional,
      };
    },
  });

  return {
    rules,
    errorsMessages,
    $validationResults,
    $category,
    $account,
    $amount,
    $additional,
    selectAccount,
    selectCategory,
    setAmount,
    setAdditional,
    validated,
    submit,
    reset,
  };
}

function createTransferForm() {
  interface Form {
    from: Account | null;
    to: Account | null;
    amount: string;
    additional: Additional;
  }

  const rules: Rules<Form> = {
    additional: preparedRules.pass,
    amount: (v) => v !== "" && !isNaN(+v),
    from: preparedRules.notNull,
    to: preparedRules.notNull,
  };

  const $from = createStore<Account | null>(null);
  const $to = createStore<Account | null>(null);
  const $amount = createStore<string>("");
  const $additional = combine<Additional>({
    timestamp: Date.now(),
    from: $from,
    to: $to,
  });
  const $validationResults = createStore<Results<Form>>({
    additional: false,
    amount: false,
    from: false,
    to: false,
  });

  const errorMessages = {
    additional: "",
    amount: "Requred, must be numeric",
    from: "Required",
    to: "Required",
  };

  const selectFrom = createEvent<Account>();
  const selectTo = createEvent<Account>();
  const setAmount = createEvent<string>();
  const setAdditional = createEvent<Omit<Additional, "timestamp">>();
  const submit = createEvent();
  const startValidation = createEvent();
  const validationCompleted = createEvent<Results<Form>>();
  const reset = createEvent();

  $from.on(selectFrom, (_, account) => account);
  $to.on(selectTo, (_, account) => account);
  $amount.on(setAmount, (_, amount) => amount);
  $additional.on(setAdditional, (previous, current) => ({
    ...previous,
    ...current,
  }));

  const $isValidationSuccessful = $validationResults.map(isSuccessful);

  sample({
    clock: [$from, $to, $amount, $additional, submit],
    target: startValidation,
  });

  sample({
    clock: startValidation,
    source: {
      from: $from,
      to: $to,
      amount: $amount,
      additional: $additional,
    },
    fn: (form): Results<Form> => {
      return {
        additional: rules.additional(form.additional),
        amount: rules.amount(form.amount),
        from: rules.from(form.from),
        to: rules.to(form.to),
      };
    },
    target: validationCompleted,
  });

  sample({
    clock: validationCompleted,
    target: $validationResults,
  });

  sample({
    clock: submit,
    source: {
      from: $from,
      to: $to,
      additional: $additional,
      amount: $amount,
    },
    filter: $isValidationSuccessful,
    fn: (form) => ({ // TODO: typings issues
      from: form.from.id,
      to: form.to.id,
      amount: form.amount,
      additional: form.additional,
    }),
    target: transactions.transfer,
  });

  return {
    $from,
    $to,
    $amount,
    $additional,
    $validationResults,
    selectFrom,
    selectTo,
    setAmount,
    setAdditional,
    submit,
    reset,
    errorMessages,
  };
}

export const incomeExpenseForm = createIncomeExpenseForm();
export const transferForm = createTransferForm();
