import { combine, createEvent, createStore, sample } from "effector";
import { and } from "patronum";

import { transactions } from "../index";
import { Account, Additional, Category, Transaction } from "../types";

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

  const $validation = createStore<Results<Form>>({
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

  const validate = createEvent();
  const submit = createEvent();
  const reset = createEvent();

  $category.on(selectCategory, (_, category) => category).reset(reset);
  $account.on(selectAccount, (_, account) => account).reset(reset);

  $amount.on(setAmount, (_, amount) => amount).reset(reset);
  $additional
    .on(setAdditional, (prev, current) => ({ ...prev, ...current }))
    .reset(reset);

  const $form = combine({
    category: $category,
    account: $account,
    amount: $amount,
    additional: $additional,
  });

  sample({
    clock: [submit, $account, $additional, $category, $amount],
    target: validate,
  });

  sample({
    clock: validate,
    source: $form,
    fn: (form) => ({
      // TODO: type-safe loop
      account: rules.account(form.account),
      additional: rules.additional(form.additional),
      category: rules.category(form.category),
      amount: rules.amount(form.amount),
    }),
    target: $validation,
  });

  const createTransaction = (form: Form, type: TransactionType) => {
    if (!form.account) {
      throw new Error(`Invalid account value: ${form.account}`);
    }

    if (!form.category) {
      throw new Error(`Invalid category value: ${form.category}`);
    }

    const transaction: Transaction = {
      account: form.account.id,
      amount: Number(form.amount),
      category: form.category,
      additional: form.additional,
    };

    if (type === TransactionType.Expense) {
      transaction.amount = transaction.amount * -1;
    }

    return transaction;
  };

  sample({
    clock: submit,
    source: { form: $form, type: $type },
    filter: and(
      $validation.map(isSuccessful),
      $type.map((t) => t !== TransactionType.Transfer)
    ),
    fn: ({ form, type }) => createTransaction(form, type),
    target: transactions.create,
  });

  return {
    rules,
    errorsMessages,
    $validation,
    $category,
    $account,
    $amount,
    $additional,
    selectAccount,
    selectCategory,
    setAmount,
    setAdditional,
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
  const $validation = createStore<Results<Form>>({
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
  const validate = createEvent();
  const reset = createEvent();

  $from.on(selectFrom, (_, account) => account);
  $to.on(selectTo, (_, account) => account);
  $amount.on(setAmount, (_, amount) => amount);
  $additional.on(setAdditional, (previous, current) => ({
    ...previous,
    ...current,
  }));

  sample({
    clock: [$from, $to, $amount, $additional, submit],
    target: validate,
  });

  sample({
    clock: validate,
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
    target: $validation,
  });

  sample({
    clock: submit,
    source: {
      from: $from,
      to: $to,
      additional: $additional,
      amount: $amount,
    },
    filter: $validation.map(isSuccessful),
    fn: (form) => {
      if (!form.from) {
        throw new Error(
          `Account from money must be transfered has not been specified`
        );
      }

      if (!form.to) {
        throw new Error(
          `Account to money must be transfered has not been specified`
        );
      }

      return {
        from: form.from.id,
        to: form.to.id,
        amount: Number(form.amount),
        additional: form.additional,
      };
    },
    target: transactions.transfer,
  });

  return {
    $from,
    $to,
    $amount,
    $additional,
    $validation,
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
