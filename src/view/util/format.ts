export const dateFormat = (value: Date|number, separator: string = '/'): string => {
  let date: Date;
  if (typeof value === 'number') {
    date = new Date(value);
  } else {
    date = value;
  }

  const year = `000${date.getFullYear()}`.slice(-4);
  const month = `00${date.getMonth() + 1}`.slice(-2);
  const day = `00${date.getDate()}`.slice(-2);
  return `${year}${separator}${month}${separator}${day}`;
};

export const dateTimeFormat = (value: Date|number, separator: string = '/'): string => {
  let date: Date;
  if (typeof value === 'number') {
    date = new Date(value);
  } else {
    date = value;
  }
  const hour = `00${date.getHours()}`.slice(-2);
  const minute = `00${date.getMinutes()}`.slice(-2);
  return `${dateFormat(date, separator)} ${hour}:${minute}`;
};
