import _ from "lodash";
import { test, expect } from "@jest/globals";
import { accounts, transactions } from "./index";

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
      difference: 15,
      type: "Salary",
      account: account.id,
    });

    expect(_.size(accounts.$balances.getState())).toBe(2);
    expect(accounts.$balances.getState()[account.id]).toBe(15);

    transactions.create({ difference: -15, type: "Food", account: account.id });
    expect(accounts.$balances.getState()[account.id]).toBe(0);

    transactions.create({
      difference: 15,
      type: "Salary",
      account: account.id,
    });

    expect(_.size(accounts.$balances.getState())).toBe(2);
  });

  test("The first account was not affected", () => {
    expect(accounts.$accounts.getState()[0].name).toBe("account1");

    expect(transactions.$transactions.getState()[0]?.length).toBeUndefined();

    expect(accounts.$balances.getState()[0]).toBe(0);
  });
});
