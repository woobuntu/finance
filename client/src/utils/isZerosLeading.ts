export const isZerosLeading = (value: string) => {
  const regex = /^0+/;
  const match = value.match(regex);

  if (match) {
    return true;
  }

  return false;
};
