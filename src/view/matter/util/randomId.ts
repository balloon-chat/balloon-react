export const randomId = (): number => {
  const MAX_INT = Number.MAX_SAFE_INTEGER;
  return Math.floor(Math.random() * MAX_INT);
};
