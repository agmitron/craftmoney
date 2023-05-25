import {
  Event,
  Store,
  combine,
  createEvent,
  createStore,
  sample,
} from "effector";

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

type Transactions = Record<AccountID, Transaction[]>;
type Balances = Record<AccountID, number>;

export const $accounts = createStore<Account[]>([]);
export const $transactions = createStore<Transactions>({});
export const $balances = $transactions.map((transactions) =>
  Object.fromEntries(
    Object.entries(transactions).map(([account, transactions = []]) => {
      return [
        account,
        transactions.reduce((sum, { difference }) => sum + difference, 0),
      ];
    })
  )
);

export const accountAdded = createEvent<Account>();
export const transactionAdded = createEvent<Transaction>();

export const createAccount = (
  id: string,
  name: string,
  currency: string
): Account => {
  return {
    id,
    currency,
    name,
  };
};

sample({
  clock: accountAdded,
  source: $accounts,
  fn: (accounts, newAccount) => [...accounts, newAccount],
  target: $accounts,
});

sample({
  clock: transactionAdded,
  source: $transactions,
  fn: (transactions, tx) => {
    const prevTransactions = transactions[tx.account] ?? [];
    return {
      ...transactions,
      [tx.account]: [...prevTransactions, tx],
    };
  },
  target: $transactions,
});
