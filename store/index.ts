import { sample } from "effector";
import _ from "lodash";

import * as accounts from "./accounts";
import * as appearance from "./appearance";
import * as categories from "./categories";
import * as currencies from "./currencies";
import * as transactions from "./transactions";

sample({
  clock: accounts.create,
  source: accounts.$accounts,
  fn: (previousAccounts, newAccount) => {
    return {
      ...previousAccounts,
      [newAccount.id]: {
        ...newAccount,
      },
    };
  },
  target: accounts.$accounts,
});

sample({
  clock: accounts.create,
  source: transactions.$transactions,
  fn: (txs, account) => ({
    ...txs,
    [account.id]: [],
  }),
  target: transactions.$transactions,
});

sample({
  clock: accounts.create,
  source: appearance.Emoji.$emoji,
  fn: (emoji, account) => ({
    ...emoji,
    accounts: { ...emoji.accounts, [account.id]: account.emoji },
  }),
  target: appearance.Emoji.$emoji,
});

sample({
  clock: accounts.remove,
  source: accounts.$accounts,
  fn: (accounts, id) => _.omit(accounts, id),
  target: accounts.$accounts,
});

sample({
  clock: accounts.update,
  source: accounts.$accounts,
  fn: (accounts, { id, upd }) => {
    const previousAccount = accounts[id];
    const newAccount = { ...previousAccount, ...upd };
    return { ...accounts, [id]: newAccount };
  },
  target: accounts.$accounts,
});

sample({
  clock: transactions.create,
  source: transactions.$transactions,
  fn: (previous, tx) => {
    const previousTransactions = transactions.getAccountTransactions(
      previous,
      tx.account,
    );
    const newTransactions = [
      ...previousTransactions,
      { ...tx, id: previousTransactions.length.toString() },
    ];

    return {
      ...previous,
      [tx.account]: newTransactions,
    };
  },
  target: transactions.$transactions,
});

sample({
  clock: transactions.transfer,
  source: {
    txs: transactions.$transactions,
    rates: currencies.$rates,
    accounts: accounts.$accounts,
  },
  fn: ({ txs, rates, accounts }, tx) => {
    const previousFrom = transactions.getAccountTransactions(txs, tx.from);
    const previousTo = transactions.getAccountTransactions(txs, tx.to);
    const sender = accounts[tx.from];
    const receiver = accounts[tx.to];

    const senderCurrencyRate = rates?.[sender.currency] ?? 1;
    const primaryCurrencyAmount = tx.amount / senderCurrencyRate;

    const receiverCurrencyRate = rates?.[receiver.currency] ?? 1;
    const toReceive = primaryCurrencyAmount * receiverCurrencyRate;

    return {
      ...txs,
      [tx.from]: [
        ...previousFrom,
        {
          account: tx.from,
          additional: tx.additional,
          amount: tx.amount * -1,
          category: categories.SystemCategories.Transfer,
          id: previousFrom.length.toString(),
        },
      ],
      [tx.to]: [
        ...previousTo,
        {
          account: tx.to,
          additional: tx.additional,
          amount: toReceive,
          category: categories.SystemCategories.Transfer,
          id: previousTo.length.toString(),
        },
      ],
    };
  },
  target: transactions.$transactions,
});

currencies.requestRates();

export { accounts, transactions, categories, appearance, currencies };
