type Form = Record<string, any>;

export type Rules<T extends Form> = {
  [K in keyof T]: (value: T[K]) => boolean;
};

export type Results<T extends Form> = {
  [K in keyof T]: boolean;
};

export type Successful<T extends Form> = {
  [K in keyof T]: true;
};

export type Failed<T extends Form> = {
  [K in keyof T]: false;
};

export type Errors<T extends Form> = {
  [K in keyof T]: string;
};

export const isSuccessful = <T extends Form>(
  value: Results<T>,
): value is Successful<T> => Object.values(value).every(Boolean);

export const isFailed = <T extends Form>(
  value: Results<T>,
): value is Failed<T> => Object.values(value).some((v) => !v);

export const preparedRules = {
  pass: () => true,
  notNull: (v: any) => v !== null,
};
