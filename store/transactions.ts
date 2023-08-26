import { createEvent, createStore, sample } from "effector";
import { Transactions, Transaction } from "./types";
import { persist } from "@effector-storage/react-native-async-storage";

export const $transactions = createStore<Transactions>({});
persist({ store: $transactions, key: "$transactions" });

export const create = createEvent<Transaction>();
