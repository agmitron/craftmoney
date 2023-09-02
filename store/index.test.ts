import { expect, test } from "@jest/globals";
import _ from "lodash";

import { accounts, transactions } from "./index";
import { Account } from "./types";

describe("Accounts", () => {
  test("Create an account", () => {
    expect(_.size(accounts.$accounts.getState())).toBe(0);

    accounts.create({ name: "account1", currency: "USD" });

    expect(_.size(accounts.$accounts.getState())).toBe(1);
  });

  test("A transaction is pushed into a created account", () => {
    expect(_.size(accounts.$accounts.getState())).toBe(1);
    accounts.create({ name: "account2", currency: "USD" });
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

    expect(transactions.$transactions.getState()[0]?.length).toBeUndefined();

    expect(accounts.$balances.getState()[0]).toBe(0);
  });

  test("Update an account", () => {
    accounts.reset();
    expect(_.size(accounts.$accounts.getState())).toBe(0);
    const account: Account = { currency: "VND", name: "VND", id: "0" };
    accounts.create(_.omit(account, "id"));
    expect(_.size(accounts.$accounts.getState())).toBe(1);

    accounts.update({ id: "0", account: { name: "Vietnamese Dongs" } });
    expect(accounts.$accounts.getState()["0"].name).toBe("Vietnamese Dongs");
    expect(accounts.$accounts.getState()["0"].id).toBe("0");
    expect(accounts.$accounts.getState()["0"].currency).toBe("VND");
  });

  test("Remove an account", () => {
    accounts.remove("0");
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
    accounts.create({ currency: "USD", name: "USD" });
    expect(_.size(accounts.$accounts.getState())).toBe(1);
    expect(accounts.$accounts.getState()[0]).toEqual({
      id: "0",
      currency: "USD",
      name: "USD",
    });
  });

  test("Buy groceries", () => {
    transactions.create({
      account: "0",
      additional: { timestamp: Date.now() },
      amount: -15,
      category: "Groceries",
    });

    expect(_.size(transactions.$transactions.getState()["0"])).toBe(1);
    expect(accounts.$balances.getState()["0"]).toBe(-15);
  });

  test("Get a salary", () => {
    transactions.create({
      account: "0",
      additional: { timestamp: Date.now() },
      amount: 150,
      category: "Salary",
    });
    expect(accounts.$balances.getState()["0"]).toBe(135);
    expect(_.size(transactions.$transactions.getState()["0"])).toBe(2);
  });

  test("Transfer the money", () => {
    const wifeAccount = accounts.create({
      currency: "USD",
      name: "USD (Wife)",
    });

    expect(_.size(accounts.$accounts.getState())).toBe(2);
    expect(accounts.$accounts.getState()["1"]).toEqual({
      id: "1",
      name: wifeAccount.name,
      currency: wifeAccount.currency,
    });

    transactions.transfer({
      from: "0",
      to: "1",
      additional: { timestamp: Date.now() },
      amount: 50,
    });

    expect(accounts.$balances.getState()["0"]).toBe(85);
    expect(accounts.$balances.getState()["1"]).toBe(50);
  });
});
