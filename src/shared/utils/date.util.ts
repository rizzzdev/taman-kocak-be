export const localDateNow = () => {
  const date = Date.now();
  const hours = 1 * 60 * 60 * 1000;
  return new Date(date + 7 * hours);
};

export const nonDeletedDate = () => {
  return new Date("1945-08-17");
};
