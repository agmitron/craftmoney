import { createEvent, createStore, sample } from "effector";

interface Transaction {
  difference: number;
  type: string;
}

export const $transactions = createStore<Transaction[]>([]);
export const $balance = $transactions.map((transactions) =>
  transactions.reduce((acc, { difference }) => acc + difference, 0)
);

export const transactionAdded = createEvent<Transaction>();

sample({
  clock: transactionAdded,
  source: $transactions,
  fn: (transactions, newTransaction) => [...transactions, newTransaction],
  target: $transactions,
});
