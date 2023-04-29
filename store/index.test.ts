import { test, expect } from "@jest/globals";
import { $accounts, accountAdded, createAccount } from ".";

describe("Accounts", () => {
  test("Create an account", () => {
    expect($accounts.getState().length).toBe(0);

    const account = createAccount("account1", "USD");
    accountAdded(account);

    expect($accounts.getState().length).toBe(1);
  });

  test("A transaction is pushed into a created account", () => {
    expect($accounts.getState().length).toBe(1);

    const account = createAccount("account2", "USD");
    accountAdded(account);
    expect($accounts.getState().length).toBe(2);

    account.transactionAdded({ difference: 15, type: "Salary" });
    expect(account.$balance.getState()).toBe(15);
    expect($accounts.getState()[1].$balance.getState()).toBe(15);

    account.transactionAdded({ difference: -15, type: "Food" });
    expect(account.$balance.getState()).toBe(0);
    expect($accounts.getState()[1].$balance.getState()).toBe(0);
  });

  test("The first account was not affected", () => {
    expect($accounts.getState()[0].name).toBe("account1");
    expect($accounts.getState()[0].$transactions.getState().length).toBe(0);
    expect($accounts.getState()[1].$transactions.getState().length).toBe(2);
  });
});
