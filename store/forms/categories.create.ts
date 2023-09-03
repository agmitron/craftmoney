import { combine, createEvent, createStore, sample } from "effector";
import { reset } from "patronum";

import { categories } from "..";

import {
  Results,
  Rules,
  isSuccessful,
  preparedRules,
} from "~/utils/validation";

interface Form {
  parent: string;
  name: string;
}

const rules: Rules<Form> = {
  parent: preparedRules.notEmptyString,
  name: preparedRules.notEmptyString,
};

export const $parent = createStore<string>("");
export const $name = createStore<string>("");
export const $validation = createStore<Results<Form>>({
  parent: false,
  name: false,
});

export const $form = combine({
  parent: $parent,
  name: $name,
});

export const setParent = createEvent<string>();
export const setName = createEvent<string>();
export const submit = createEvent();
export const validate = createEvent();
export const clear = createEvent();

$parent.on(setParent, (_, name) => name);
$name.on(setName, (_, currency) => currency);

reset({ clock: clear, target: [$parent, $name] });

sample({
  clock: [$parent, $name, submit],
  target: validate,
});

sample({
  clock: validate,
  source: $form,
  fn: (form) => ({
    parent: rules.parent(form.parent),
    name: rules.name(form.name),
  }),
  target: $validation,
});

sample({
  clock: submit,
  source: $form,
  filter: $validation.map(isSuccessful),
  fn: (form) => ({ parent: form.parent, name: form.name }),
  target: categories.create,
});
