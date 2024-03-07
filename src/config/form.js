import { computePriceFromQuantitySpecies, handleSubSpeciesVisibility } from "../utilities";

const CONSTANTS = {
  fullName: "fullName",
  nickname: "nickname",
  email: "email",
  phoneNumber: "phoneNumber",
  numberOfFish: "numberOfFish",
  addressLine1: "addressLine1",
  radioOption: "radioOption",
  addressLine2: "addressLine2",
  city: "city",
  state: "state",
  zipcode: "zipcode",
  occupation: "occupation",
  department: "department",
  species: "species",
  subSpecies: "subSpecies",
  computedPrice: "computedPrice",
};

const VISIBILITY = {
  [CONSTANTS.nickname]: {
    callback: (args, formData) => {
      let data = args[0];
      if (!formData[data]) {
        return false;
      } else {
        return true;
      }
    },
    args: [CONSTANTS.fullName],
    visibleOnMount: false,
  },
  [CONSTANTS.subSpecies]: {
    callback: handleSubSpeciesVisibility,
    args: [CONSTANTS.species],
    visibleOnMount: false,
  },
};

const COMPUTED = {
  [CONSTANTS.computedPrice]: {
    callback: computePriceFromQuantitySpecies,
    args: [CONSTANTS.numberOfFish, CONSTANTS.species],
  },
};

const VALIDATION = {};

const FORM_CONFIG = {
  [CONSTANTS.fullName]: {
    visibility: VISIBILITY[CONSTANTS.fullName],
    computed: COMPUTED[CONSTANTS.fullName],
    validation: VALIDATION[CONSTANTS.fullName],
  },
  [CONSTANTS.nickname]: {
    visibility: VISIBILITY[CONSTANTS.nickname],
    computed: COMPUTED[CONSTANTS.nickname],
    validation: VALIDATION[CONSTANTS.nickname],
  },
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
