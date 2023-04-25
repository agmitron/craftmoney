import { test, expect } from "@jest/globals";
import { $balance, $transactions, transactionAdded } from ".";

test("The transaction is added and the balance is changed", () => {
  expect($balance.getState()).toEqual(0);
  expect($transactions.getState().length).toEqual(0);

  transactionAdded({ difference: -15, type: "Groceries" });

  expect($transactions.getState().length).toEqual(1);
  expect($transactions.getState()[0].difference).toEqual(-15);
  expect($transactions.getState()[0].type).toEqual("Groceries");
  expect($balance.getState()).toEqual(-15);
});
