type Value = Record<string, any>;

export type Rules<T extends Value> = {
  [K in keyof T]: (value: T[K]) => boolean;
};

export type Results<T extends Value> = {
  [K in keyof T]: boolean;
};

export type Successful<T extends Value> = {
  [K in keyof T]: true;
};

export type Failed<T extends Value> = {
  [K in keyof T]: false;
};

export const isSuccessful = <T extends Value>(
  value: Results<T>,
): value is Successful<T> => Object.values(value).every(Boolean);

export const isFailed = <T extends Value>(
  value: Results<T>,
): value is Successful<T> => Object.values(value).some((v) => !v);
