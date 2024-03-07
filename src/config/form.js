import { computePriceFromQuantitySpecies, handleSubSpeciesVisibility } from "../utilities";

const CONSTANTS = {
  numberOfFish: "numberOfFish",
  species: "species",
  subSpecies: "subSpecies",
  computedPrice: "computedPrice",
};

const VISIBILITY = {
  [CONSTANTS.numberOfFish]: {
    callback: null,
    args: [],
    visibleOnMount: true,
  },
  [CONSTANTS.species]: {
    callback: null,
    args: [],
    visibleOnMount: true,
  },
  [CONSTANTS.subSpecies]: {
    callback: handleSubSpeciesVisibility,
    args: [CONSTANTS.species],
    visibleOnMount: false,
  },
  [CONSTANTS.computedPrice]: {
    callback: null,
    args: [],
    visibleOnMount: true,
  },
};

const COMPUTED = {
  [CONSTANTS.numberOfFish]: {
    callback: null,
    args: [],
  },
  [CONSTANTS.species]: {
    callback: null,
    args: [],
  },
  [CONSTANTS.subSpecies]: {
    callback: null,
    args: [],
  },
  [CONSTANTS.computedPrice]: {
    callback: computePriceFromQuantitySpecies,
    args: [CONSTANTS.numberOfFish, CONSTANTS.species],
  },
};

const VALIDATION = {
  [CONSTANTS.numberOfFish]: {},
  [CONSTANTS.species]: {},
  [CONSTANTS.subSpecies]: {},
  [CONSTANTS.computedPrice]: {},
};

const FORM_CONFIG = {
  [CONSTANTS.numberOfFish]: {
    visibility: VISIBILITY[CONSTANTS.numberOfFish],
    computed: COMPUTED[CONSTANTS.numberOfFish],
    validation: VALIDATION[CONSTANTS.numberOfFish],
  },
  [CONSTANTS.subSpecies]: {
    visibility: VISIBILITY[CONSTANTS.subSpecies],
    computed: COMPUTED[CONSTANTS.subSpecies],
    validation: VALIDATION[CONSTANTS.subSpecies],
  },
  [CONSTANTS.species]: {
    visibility: VISIBILITY[CONSTANTS.species],
    computed: COMPUTED[CONSTANTS.species],
    validation: VALIDATION[CONSTANTS.species],
  },
  [CONSTANTS.computedPrice]: {
    visibility: VISIBILITY[CONSTANTS.computedPrice],
    computed: COMPUTED[CONSTANTS.computedPrice],
    validation: VALIDATION[CONSTANTS.computedPrice],
  },
};

export { FORM_CONFIG, CONSTANTS };
