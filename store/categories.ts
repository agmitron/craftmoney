import { createStore } from "effector";
import { Categories } from "./types";
import { persist } from "@effector-storage/react-native-async-storage";

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
