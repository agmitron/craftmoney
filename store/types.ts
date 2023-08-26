
export type AccountID = string;

export interface Transaction {
  difference: number;
  category: string;
  account: AccountID;
}

export interface Account {
  id: AccountID;
  currency: string;
  name: string;
}

export type Accounts = Record<AccountID, Account>;
export type Balances = Record<AccountID, number>;
export type Transactions = Record<AccountID, Transaction[]>;

export type Categories = {
  [name: string]: Categories | null;
};