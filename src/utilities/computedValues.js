const speciesPriceMap = {
  grouper: 25.0,
  salmon: 58.0,
};

const computePriceFromQuantitySpecies = (values) => {
  let computedPrice = parseInt(values[0] || 0) * parseInt(speciesPriceMap[values[1]] || 0);
  return computedPrice.toString();
};

export { computePriceFromQuantitySpecies };
