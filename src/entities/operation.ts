import { Currency } from "./currency";

export interface Operation {
  id: string;
  account: string;
  delta: number;
  date: string;
  currency: Currency;
  tags: string[];
}
