import { persist } from "@effector-storage/react-native-async-storage";
import { createEffect, createEvent, createStore, sample } from "effector";

type Currency = string;
type Rates = Record<Currency, number>;

export function convert(value: number, rate: number): number {
  return value * rate;
}

export function getRate(amountA: number, amountB: number) {
  return amountA / amountB;
}

export const $primary = createStore<Currency>("USD"); // TODO
persist({ key: "currencies.$primary", store: $primary });

export const $rates = createStore<Rates | null>(null);
persist({ key: "currencies.$rates", store: $rates });

const requestRatesFx = createEffect(async (): Promise<Rates> => {
  // TODO: config
  if (!process.env.EXPO_PUBLIC_CURRENCY_API_KEY) {
    throw new Error("EXPO_PUBLIC_CURRENCY_API_KEY was not provided");
  }

  const response = await fetch(`https://api.freecurrencyapi.com/v1/latest`, {
    headers: {
      apikey: process.env.EXPO_PUBLIC_CURRENCY_API_KEY,
    },
  });

  const { data } = await response.json();
  // TODO: response validation
  return data as Rates;
});

export const requestRates = createEvent();
export const setRates = createEvent<Rates>();
export const setPrimary = createEvent<Currency>();

sample({
  clock: requestRates,
  target: requestRatesFx,
});

sample({
  clock: requestRatesFx.doneData,
  target: setRates,
});

sample({
  clock: setRates,
  target: $rates,
});

sample({
  clock: setPrimary,
  target: $primary,
});
