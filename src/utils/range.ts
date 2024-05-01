export const takeRange = <T>(list: T[], step: number, page: number = 0) => {
  const start = page * step;
  const end = start + step;
  return list.slice(start, end);
};
