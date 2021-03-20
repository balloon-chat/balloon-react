export const dateFormat = (date: Date, separator: string = '/'): string => {
  const year = `000${date.getFullYear()}`.slice(-4);
  const month = `00${date.getMonth() + 1}`.slice(-2);
  const day = `00${date.getDate()}`.slice(-2);
  return `${year}${separator}${month}${separator}${day}`;
};
