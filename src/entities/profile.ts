import { Account } from "./account";

export interface Profile {
  id: string;
  name: string;
  accounts: Account[];
}

export class ProfileStore implements Profile {
  id: string;
  name: string;
  accounts: Account[];

  constructor(id: string, name: string, accounts: Account[]) {
    this.id = id;
    this.name = name;
    this.accounts = accounts;
  }
}
