import { createEvent, createStore } from "effector";
import { Account } from "./types";

export enum TransactionType {
  Transfer,
  Income,
  Expense,
}

export const $category = createStore<string | null>(null);
export const $account = createStore<Account | null>(null);
export const $difference = createStore("");
export const $type = createStore<TransactionType>(TransactionType.Expense);

export const selectCategory = createEvent<string>();
export const selectType = createEvent<TransactionType>();
export const setDifference = createEvent<string>();

$category.on(selectCategory, (_, category) => category);
$type.on(selectType, (_, type) => type);
$difference.on(setDifference, (_, difference) => difference);
