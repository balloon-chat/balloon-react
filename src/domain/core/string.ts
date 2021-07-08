export const isEmpty = (value: string) => value.length === 0;

export const isBlank = (value: string) => {
  const removedWhiteSpace = value.replace(/\s/g, '');
  return removedWhiteSpace.length === 0;
};
