import { createEvent, createStore } from "effector";

export enum TransactionType {
  Transfer,
  Income,
  Expense,
}

export const $category = createStore("Tap to select");
export const $difference = createStore("");
export const $type = createStore<TransactionType>(TransactionType.Expense);

export const selectCategory = createEvent<string>();

$category.on(selectCategory, (_, category) => category);
