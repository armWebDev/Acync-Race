export const getPageCount = (total: number, limit: number): number =>
  Math.max(1, Math.ceil(total / limit));

export const getPageOffset = (page: number, limit: number): number => (page - 1) * limit;
