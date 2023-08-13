import { createEvent, createStore, sample } from "effector";

type AccountID = string;

interface Transaction {
  difference: number;
  type: string;
  account: AccountID;
}

interface Account {
  id: AccountID;
  currency: string;
  name: string;
}

type Accounts = Record<AccountID, Account>;
type Balances = Record<AccountID, number>;
type Transactions = Record<AccountID, Transaction[]>;

export type Categories = {
  [name: string]: Categories | null;
};

export const $accounts = createStore<Accounts>({});
export const $categories = createStore<Categories>({
  food: {
    restaurants: {
      kfc: null,
      mcdonalds: null,
    },
  },
  investments: {
    crypto: {
      altcoins: null,
      web3: null,
      gamefi: null,
    },
    stocks: {
      snp500: null,
      etf: null,
    },
  },
});
export const $balances = createStore<Balances>({});
export const $transactions = createStore<Transactions>({});

export const accountAdded = createEvent<Account>();
export const transactionAdded = createEvent<Transaction>();

export const createAccount = (
  name: string,
  currency: string,
  id: AccountID
): Account => {
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
  };
};

sample({
  clock: accountAdded,
  source: $accounts,
  fn: (accounts, newAccount) => ({ ...accounts, [newAccount.id]: newAccount }),
  target: $accounts,
});

sample({
  clock: accountAdded,
  source: $balances,
  fn: (balances, account) => ({ ...balances, [account.id]: 0 }),
  target: $balances,
});

sample({
  clock: transactionAdded,
  source: $transactions,
  fn: (transactions, newTransaction) => {
    const previousTransactions = transactions?.[newTransaction.account] ?? [];
    const newTransactions = [...previousTransactions, newTransaction];

    return {
      ...transactions,
      [newTransaction.account]: newTransactions,
    };
  },
  target: $transactions,
});

$accounts.watch(console.log);

const account1 = createAccount("USD", "USD", "0");
accountAdded(account1);
const account2 = createAccount("THB", "THB", "1");
accountAdded(account2);
const account3 = createAccount("RUB", "RUB", "2");
accountAdded(account3);

transactionAdded({ account: account1.id, difference: -15, type: "food" });
transactionAdded({ account: account1.id, difference: -15, type: "food" });
transactionAdded({ account: account1.id, difference: -15, type: "food" });
transactionAdded({ account: account1.id, difference: -15, type: "food" });
