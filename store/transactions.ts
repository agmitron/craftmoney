import { createEvent, createStore, sample } from 'effector';
import { Transactions, Transaction } from './types';

export const $transactions = createStore<Transactions>({});

export const create = createEvent<Transaction>();