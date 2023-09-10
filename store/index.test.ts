import { expect, test } from "@jest/globals";
import { createEvent } from "effector";
import _ from "lodash";

import { accounts, categories, transactions, currencies } from "./index";

// Only for testing
const resetRates = createEvent();
const resetPrimaryCurrency = createEvent();
currencies.$rates.reset(resetRates);
currencies.$primary.reset(resetPrimaryCurrency);

describe("Accounts", () => {
  test("Create an account", () => {
    expect(_.size(accounts.$accounts.getState())).toBe(0);

    accounts.create({
      name: "account1",
      currency: "USD",
      emoji: "🇺🇸",
      id: "0",
    });

    expect(_.size(accounts.$accounts.getState())).toBe(1);
  });

  test("A transaction is pushed into a created account", () => {
    expect(_.size(accounts.$accounts.getState())).toBe(1);
    accounts.create({
      name: "account2",
      currency: "USD",
      id: "1",
      emoji: "🇺🇸",
    });
    expect(_.size(accounts.$accounts.getState())).toBe(2);
    const account = accounts.$accounts.getState()[1];

    expect(account.name).toBe("account2");

    transactions.create({
      amount: 15,
      account: account.id,
      category: "Salary",
      additional: { timestamp: Date.now() },
    });

    expect(_.size(accounts.$balances.getState())).toBe(2);

    expect(accounts.$balances.getState()[account.id]).toBe(15);

    transactions.create({
      amount: -15,
      category: "Food",
      account: account.id,
      additional: { timestamp: Date.now() },
    });
    expect(accounts.$balances.getState()[account.id]).toBe(0);

    transactions.create({
      amount: 15,
      category: "Salary",
      account: account.id,
      additional: { timestamp: Date.now() },
    });

    expect(_.size(accounts.$balances.getState())).toBe(2);
  });

  test("The first account was not affected", () => {
    expect(accounts.$accounts.getState()[0].name).toBe("account1");

    expect(transactions.$transactions.getState()[0]?.length).toBe(0);

    expect(accounts.$balances.getState()[0]).toBe(0);
  });

  test("Update an account", () => {
    accounts.reset();
    expect(_.size(accounts.$accounts.getState())).toBe(0);
    const id = "2";
    const account = { currency: "VND", name: "VND", emoji: "🇺🇸", id };
    accounts.create(account);
    expect(_.size(accounts.$accounts.getState())).toBe(1);

    accounts.update({ id, upd: { name: "Vietnamese Dongs" } });
    expect(accounts.$accounts.getState()[id].name).toBe("Vietnamese Dongs");
    expect(accounts.$accounts.getState()[id].id).toBe(id);
    expect(accounts.$accounts.getState()[id].currency).toBe("VND");
  });

  test("Remove an account", () => {
    accounts.remove("2");
    expect(_.size(accounts.$accounts.getState())).toBe(0);
  });
});

describe("Transactions", () => {
  test("Reset states", () => {
    accounts.reset();
    expect(_.size(accounts.$accounts.getState())).toBe(0);

    transactions.reset();
    expect(_.size(transactions.$transactions.getState())).toBe(0);
  });

  test("Create a new USD account", () => {
    const id = "3";
    accounts.create({
      currency: "USD",
      name: "USD",
      emoji: "🇺🇸",
      id,
    });
    expect(_.size(accounts.$accounts.getState())).toBe(1);
    expect(accounts.$accounts.getState()[id]).toEqual({
      id,
      currency: "USD",
      name: "USD",
      emoji: "🇺🇸",
    });
  });

  test("Buy groceries", () => {
    const id = "3";
    transactions.create({
      account: id,
      additional: { timestamp: Date.now() },
      amount: -15,
      category: "Groceries",
    });

    expect(_.size(transactions.$transactions.getState()[id])).toBe(1);
    expect(accounts.$balances.getState()[id]).toBe(-15);
  });

  test("Get a salary", () => {
    const id = "3";
    transactions.create({
      account: id,
      additional: { timestamp: Date.now() },
      amount: 150,
      category: "Salary",
    });
    expect(accounts.$balances.getState()[id]).toBe(135);
    expect(_.size(transactions.$transactions.getState()[id])).toBe(2);
  });

  test("Transfer the money", () => {
    const wifeAccountID = "4";
    const wifeAccount = accounts.create({
      currency: "USD",
      name: "USD (Wife)",
      emoji: "🇺🇸",
      id: wifeAccountID,
    });

    expect(_.size(accounts.$accounts.getState())).toBe(2);
    expect(accounts.$accounts.getState()[wifeAccountID]).toEqual({
      id: wifeAccountID,
      name: wifeAccount.name,
      currency: wifeAccount.currency,
      emoji: "🇺🇸",
    });

    currencies.setRates({ USD: 1 });

    transactions.transfer({
      from: "3",
      to: wifeAccountID,
      additional: { timestamp: Date.now() },
      amount: 50,
    });

    expect(accounts.$balances.getState()["3"]).toBe(85);
    expect(accounts.$balances.getState()[wifeAccountID]).toBe(50);
  });

  test("Transfer the money in different currencies", () => {
    currencies.setPrimary("USD");
    expect(currencies.$primary.getState()).toBe("USD");

    currencies.setRates({ VND: 24_000, EUR: 0.93 });
    expect(currencies.$rates.getState()).toEqual({ VND: 24_000, EUR: 0.93 });

    const vndAccount = accounts.create({
      currency: "VND",
      emoji: "🇻🇳",
      id: "5",
      name: "VND",
    });

    transactions.create({
      account: vndAccount.id,
      additional: { timestamp: Date.now() },
      amount: 25_000_000,
      category: "Salary",
    });

    const euroAccount = accounts.create({
      currency: "EUR",
      emoji: "🇪🇺",
      id: "6",
      name: "EURO",
    });

    transactions.transfer({
      from: vndAccount.id,
      to: euroAccount.id,
      amount: 23_000_000,
      additional: { timestamp: Date.now() },
    });

    let euroAccountBalance = accounts.$balances.getState()[euroAccount.id];
    let vndAccountBalance = accounts.$balances.getState()[vndAccount.id];

    expect(Math.floor(euroAccountBalance)).toBe(891);
    expect(vndAccountBalance).toBe(2_000_000);

    transactions.transfer({
      from: euroAccount.id,
      to: vndAccount.id,
      amount: 500,
      additional: { timestamp: Date.now() },
    });

    euroAccountBalance = accounts.$balances.getState()[euroAccount.id];
    vndAccountBalance = accounts.$balances.getState()[vndAccount.id];

    expect(Math.floor(euroAccountBalance)).toBe(391);
    expect(Math.floor(vndAccountBalance)).toBe(2_000_000 + 12_903_225);
  });

  test("Remove a transaction", () => {
    const wifeAccountID = "4";
    expect(transactions.$transactions.getState()[wifeAccountID].length).toBe(1);

    transactions.remove({
      id: "0",
      account: wifeAccountID,
    });

    expect(transactions.$transactions.getState()[wifeAccountID].length).toBe(0);
  });
});

describe("Categories", () => {
  test("Create a category", () => {
    const initialCategories = {
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
    };
    expect(categories.$categories.getState()).toEqual(initialCategories);

    categories.create({ name: "Taco Bell", parent: "food.restaurants" });
    expect(categories.$categories.getState()).not.toEqual(initialCategories);
    expect(categories.$categories.getState()).not.toBe(null);
    expect(
      categories.$categories.getState()?.food?.restaurants?.["Taco Bell"]
    ).not.toBeUndefined();
    expect(
      categories.$categories.getState()?.food?.restaurants?.["Taco Bell"]
    ).toBe(null);
  });

  test("Remove a category", () => {
    categories.remove(["food.restaurants.Taco Bell", "food.restaurants.kfc"]);

    expect(
      _.get(categories.$categories.getState(), "food.restaurants")
    ).toEqual({ mcdonalds: null });
  });

  test("Update a category", () => {
    categories.update({
      previous: "investments.crypto.gamefi",
      current: "investments.crypto.Web3 Games",
    });

    expect(
      _.get(categories.$categories.getState(), "investments.crypto")
    ).toEqual({
      altcoins: null,
      web3: null,
      "Web3 Games": null,
    });
  });
});
