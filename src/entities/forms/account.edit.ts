import { combine, createEvent, createStore, sample } from "effector";
import { spread } from "patronum";

import { AccountID } from "../types";

import * as accounts from "~/entities/accounts";
import {
  Results,
  Rules,
  isSuccessful,
  preparedRules,
} from "~/utils/validation";

interface Form {
  name: string;
  currency: string;
}

export const $name = createStore<string>("");
export const $currency = createStore<string>("");
export const $validation = createStore<Results<Form>>({
  currency: false,
  name: false,
});

export const $form = combine({
  name: $name,
  currency: $currency,
});

export const init = createEvent<AccountID>();
export const setName = createEvent<string>();
export const setCurrency = createEvent<string>();
export const submit = createEvent<AccountID>();
export const validate = createEvent();

$name.on(setName, (_, name) => name);
$currency.on(setCurrency, (_, currency) => currency);

const rules: Rules<Form> = {
  currency: preparedRules.notEmptyString,
  name: preparedRules.notEmptyString,
};

sample({
  clock: [$name, $currency, submit],
  target: validate,
});

sample({
  clock: validate,
  source: $form,
  fn: (form) => ({
    name: rules.name(form.name),
    currency: rules.currency(form.currency),
  }),
  target: $validation,
});

sample({
  clock: submit,
  source: $form,
  filter: $validation.map(isSuccessful),
  fn: (form, id) => ({
    id,
    upd: { currency: form.currency, name: form.name },
  }),
  target: accounts.update,
});

sample({
  clock: init,
  source: accounts.$accounts,
  fn: (accounts, id) => ({
    name: accounts[id].name,
    currency: accounts[id].currency,
  }),
  target: spread({
    targets: {
      name: $name,
      currency: $currency,
    },
  }),
});
