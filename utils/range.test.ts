import { describe, test } from "@jest/globals";

import { takeRange } from "./range";

describe("takeRange", () => {
  test("[1, 2, 3, 4]; page: 0; step: 2 -> [1, 2]", () => {
    const list = [1, 2, 3, 4];
    const range = takeRange(list, 2);
    expect(range).toEqual([1, 2]);
  });

  test("[1, 2, 3, 4]; page: 1; step: 2 -> [4]", () => {
    const list = [1, 2, 3, 4];
    const range = takeRange(list, 2, 1);
    expect(range).toEqual([3, 4]);
  });

  test("[1, 2, 3, 4]; page: 0; step: 3 -> [1, 2, 3]", () => {
    const list = [1, 2, 3, 4];
    const range = takeRange(list, 3, 0);
    expect(range).toEqual([1, 2, 3]);
  });

  test("[1, 2, 3, 4]; page: 1; step: 3 -> [4]", () => {
    const list = [1, 2, 3, 4];
    const range = takeRange(list, 3, 1);
    expect(range).toEqual([4]);
  });
});
