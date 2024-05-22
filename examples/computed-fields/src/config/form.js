const CONSTANTS = {
  species: "species",
  numberOfFish: "numberOfFish",
  computedPrice: "computedPrice",
};

const computePriceFromQuantitySpecies = (numberOfFish, species) => {
  console.log(numberOfFish, species);
  const speciesPriceMap = {
    grouper: 25.0,
    salmon: 58.0,
    marlin: 100.0,
    mahimahi: 44.0,
  };

  let computedPrice = parseInt(numberOfFish || 0) * parseInt(speciesPriceMap[species] || 0);
  return computedPrice.toString();
};

const FORM_CONFIG = {
  [CONSTANTS.computedPrice]: {
    visibility: null,
    computed: {
      callback: computePriceFromQuantitySpecies,
      args: [CONSTANTS.numberOfFish, CONSTANTS.species],
    },
    validation: null,
  },
};

export { FORM_CONFIG, CONSTANTS, computePriceFromQuantitySpecies };
