import { persist } from "@effector-storage/react-native-async-storage";
import { createEvent, createStore } from "effector";
import _ from "lodash";

import { Categories, Category } from "./types";

export enum SystemCategories {
  Transfer = "__transfer__",
}

export const $categories = createStore<Categories>({
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
});

persist({ store: $categories, key: "$categories" });

export const reset = createEvent();
export const create = createEvent<{ name: Category; parent?: Category }>();
export const remove = createEvent<Category[]>();
export const update = createEvent<{
  previous: Category;
  current: Partial<Category>;
}>();

$categories.reset(reset);

$categories.on(create, (categories, { name, parent = "" }) =>
  _.set(categories, `${parent}.${name}`, null)
);

$categories.on(remove, (categories, removable) =>
  _.omit(categories, removable)
);

$categories.on(update, (categories, { current, previous }) =>
  _.set(_.omit(categories, previous), current, null),
);
