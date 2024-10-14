import { Currency } from "./currency";
import { Operation } from "./operation";

export interface Account {
  id: string;
  name: string;
  currency: Currency;
  balance: number;
  operations: Operation[];

  addOperation(o: Operation): void;
  deleteOperation(o: Operation): void;
}

export class AccountStore implements Account {
  id: string;
  name: string;
  currency: Currency;
  private _operations: Operation[] = [];

  constructor(id: string, name: string, currency: Currency) {
    this.id = id;
    this.name = name;
    this.currency = currency;
  }

  addOperation(o: Operation): void {
    this._operations.push(o);
  }

  deleteOperation(o: Operation): void {
    this._operations = this._operations.filter((op) => op !== o);
  }

  get operations(): Operation[] {
    return this._operations;
  }

  get balance(): number {
    return this._operations.reduce((acc, op) => acc + op.delta, 0);
  }
}
