export const toDollarString = (number: number) => {
  if (number < 1 && number != 0) {
    return number.toFixed(1) + "0¢";
  } else {
    return "$" + `${number.toFixed(1) + "0"}`;
  }
};
