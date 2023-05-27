import { createEvent, createStore } from "effector";

type OperationType = "income" | "expense" | "transfer";
type Additional = Record<string, string>;

const $amount = createStore("");
const $account = createStore<string>("0");
const $category = createStore<string>("");
const $type = createStore<OperationType>("expense");
const $additional = createStore<Additional>({});

const amountChanged = createEvent<string>();
const accountChanged = createEvent<string>();
const categoryChanged = createEvent<string>();
const typeChanged = createEvent<OperationType>();
const additionalChanged = createEvent<Additional>();
const addButtonPressed = createEvent();

const update = <T>(_: T, value: T) => value;

$amount.on(amountChanged, update);
$account.on(accountChanged, update);
$category.on(categoryChanged, update);
$type.on(typeChanged, update);
$additional.on(additionalChanged, update);

export {
  $account,
  $additional,
  $amount,
  $type,
  $category,
  amountChanged,
  accountChanged,
  categoryChanged,
  typeChanged,
  additionalChanged,
  addButtonPressed,
};
