export const handleComputedValuesLogic = (inputIds, formData, FORM_CONFIG) => {
  for (let inputId of inputIds) {
    const computedCallback = FORM_CONFIG[inputId]?.computed?.callback;
    if (computedCallback) {
      const args = FORM_CONFIG[inputId].computed.args.map((arg) => formData[arg]);
      const computedValue = computedCallback(args);
      formData[inputId] = computedValue;
    }
  }
};

const speciesPriceMap = {
  grouper: 25.0,
  salmon: 58.0,
  marlin: 100.0,
  mahimahi: 44.0,
};

const computePriceFromQuantitySpecies = (values) => {
  let computedPrice = parseInt(values[0] || 0) * parseInt(speciesPriceMap[values[1]] || 0);
  return computedPrice.toString();
};

export { computePriceFromQuantitySpecies };
