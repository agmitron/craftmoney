import { expect, test } from "@jest/globals";

import { flattenCategories } from "./categories";

describe("utils/categories.ts", () => {
  test("flattenCategories", () => {
    const categories = {
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

    const expected = {
      food: null,
      "food.restaurants": null,
      "food.restaurants.kfc": null,
      "food.restaurants.mcdonalds": null,
      investments: null,
      "investments.crypto": null,
      "investments.crypto.altcoins": null,
      "investments.crypto.web3": null,
      "investments.crypto.gamefi": null,
      "investments.stocks": null,
      "investments.stocks.snp500": null,
      "investments.stocks.etf": null,
    };

    const actual = flattenCategories(categories);

    expect(actual).toStrictEqual(expected);
  });

  test("flattenCategories with another separator", () => {
    const categories = {
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

    const expected = {
      food: null,
      "food/restaurants": null,
      "food/restaurants/kfc": null,
      "food/restaurants/mcdonalds": null,
      investments: null,
      "investments/crypto": null,
      "investments/crypto/altcoins": null,
      "investments/crypto/web3": null,
      "investments/crypto/gamefi": null,
      "investments/stocks": null,
      "investments/stocks/snp500": null,
      "investments/stocks/etf": null,
    };

    const actual = flattenCategories(categories, "", {}, "/");

    expect(actual).toStrictEqual(expected);
  });
});
