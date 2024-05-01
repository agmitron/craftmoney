import { Store, combine, createEvent, createStore, sample } from "effector";
import { reset } from "patronum";

import { appearance, categories } from "..";

import {
  Results,
  Rules,
  isSuccessful,
  preparedRules,
} from "~/utils/validation";

interface Form {
  parent: string;
  name: string;
  emoji: string;
}

const rules: Rules<Form> = {
  parent: preparedRules.notEmptyString,
  name: preparedRules.notEmptyString,
  emoji: preparedRules.notEmptyString,
};

export const $parent = createStore<string>("");
export const $name = createStore<string>("");
export const $emoji = createStore<string>("");
export const $validation = createStore<Results<Form>>({
  parent: false,
  name: false,
  emoji: false,
});

export const $form: Store<Form> = combine({
  parent: $parent,
  name: $name,
  emoji: $emoji,
});

export const setParent = createEvent<string>();
export const setName = createEvent<string>();
export const setEmoji = createEvent<string>();
export const submit = createEvent();
export const validate = createEvent();
export const clear = createEvent();

$parent.on(setParent, (_, name) => name);
$name.on(setName, (_, currency) => currency);
$emoji.on(setEmoji, (_, emoji) => emoji);

reset({ clock: clear, target: [$parent, $name] });

sample({
  clock: [$parent, $name, $emoji, submit],
  target: validate,
});

sample({
  clock: validate,
  source: $form,
  fn: (form) => ({
    parent: rules.parent(form.parent),
    name: rules.name(form.name),
    emoji: rules.emoji(form.emoji),
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

$emoji.watch((e) => console.log({ e }));
$parent.watch((p) => console.log({ p }));
$validation.watch((v) => console.log({ v }));

sample({
  clock: submit,
  source: $form,
  filter: $validation.map(isSuccessful),
  fn: ({ emoji, name }) => ({ path: `categories.${name}`, emoji }),
  target: appearance.Emoji.setEmoji,
});
