export const isEmpty = (value: string) => value.length === 0;

export const isNotEmpty = (value: string) => !isEmpty(value);

export const isBlank = (value: string) => {
  const removedWhiteSpace = value.replace(/\s/g, '');
  return removedWhiteSpace.length === 0;
};

export const isNotBlank = (value: string) => !isBlank(value);
