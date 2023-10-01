import { combine, createEvent, createStore, sample } from "effector";
import { nanoid } from "nanoid";
import { reset } from "patronum";

import * as accounts from "~/store/accounts";
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

export const setName = createEvent<string>();
export const setCurrency = createEvent<string>();
export const submit = createEvent();
export const validate = createEvent();
export const clear = createEvent();

$name.on(setName, (_, name) => name);
$currency.on(setCurrency, (_, currency) => currency);

reset({ clock: clear, target: [$name, $currency] });

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
  fn: (form) => ({
    currency: form.currency,
    name: form.name,
    id: nanoid(),
    emoji: "👍",
  }),
  target: accounts.create,
});
