import { createStore } from 'effector';
import { Categories } from './types';

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