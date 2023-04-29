import { Event, Store, createEvent, createStore, sample } from "effector";

type AccountID = string;

interface Transaction {
  difference: number;
  type: string;
}

interface Account {
  id: AccountID;
  currency: string;
  name: string;
  $balance: Store<number>;
  $transactions: Store<Transaction[]>;
  transactionAdded: Event<Transaction>;
}

export const $accounts = createStore<Account[]>([]);
export const accountAdded = createEvent<Account>();

export const createAccount = (name: string, currency: string): Account => {
  const id = `${Math.random() * 100}`;

  const $transactions = createStore<Transaction[]>([]);
  const $balance = createStore<number>(0);

  const transactionAdded = createEvent<Transaction>();

  sample({
    clock: transactionAdded,
    source: $balance,
    fn: (balance, { difference }) => balance + difference,
    target: $balance,
  });

  sample({
    clock: transactionAdded,
    source: $transactions,
    fn: (state, transaction) => [...state, transaction],
    target: $transactions,
  });

  return {
    id,
    currency,
    name,
    $balance,
    $transactions,
    transactionAdded,
  };
};

sample({
  clock: accountAdded,
  source: $accounts,
  fn: (accounts, newAccount) => [...accounts, newAccount],
  target: $accounts,
});
