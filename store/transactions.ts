import { persist } from "@effector-storage/react-native-async-storage";
import { createEvent, createStore } from "effector";

import { Transaction, Transactions } from "./types";

export const $transactions = createStore<Transactions>({});
persist({ store: $transactions, key: "$transactions" });

export const create = createEvent<Transaction>();
