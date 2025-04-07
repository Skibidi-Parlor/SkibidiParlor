export const toDollarString = (number: number) => {
  if (number < 1 && number != 0) {
    return number + "0¢";
  } else {
    return "$" + `${number + (number % 1 != 0 ? "0" : ".00")}`;
  }
};
