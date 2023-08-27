export type NonNullableStructure<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
}

export type NullableStructure<T> = {
  [K in keyof T]-?: null;
}

export const isNullable = <T>(structure: Record<string, any>): structure is NullableStructure<T> => {
  for (let key in structure) {
    if (structure[key] === null) {
      return true
    }
  }

  return false
}

export const isNonNullable = <T>(structure: Record<string, any>): structure is NonNullableStructure<T> => {
  for (let key in structure) {
    if (structure[key] === null) {
      return false
    }
  }

  return true
}