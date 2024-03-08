import {
  computePriceFromQuantitySpecies,
  handleCountryVisibility,
  handleNicknameVisibility,
  handleSubSpeciesVisibility,
} from "../utilities";

const CONSTANTS = {
  fullName: "fullName",
  nickname: "nickname",
  email: "email",
  phoneNumber: "phoneNumber",
  country: "country",
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

const FORM_CONFIG = {
  [CONSTANTS.fullName]: {
    visibility: null,
    computed: null,
    validation: null,
  },
  [CONSTANTS.nickname]: {
    visibility: {
      callback: handleNicknameVisibility,
      args: [CONSTANTS.fullName],
      visibleOnMount: false,
    },
    computed: null,
    validation: null,
  },
  [CONSTANTS.email]: {
    visibility: null,
    computed: null,
    validation: null,
  },
  [CONSTANTS.phoneNumber]: {
    visibility: null,
    computed: null,
    validation: null,
  },
  [CONSTANTS.country]: {
    visibility: {
      callback: handleCountryVisibility,
      args: [CONSTANTS.phoneNumber],
      visibleOnMount: false,
    },
    computed: null,
    validation: null,
  },
  [CONSTANTS.numberOfFish]: {
    visibility: null,
    computed: null,
    validation: null,
  },
  [CONSTANTS.addressLine1]: {
    visibility: null,
    computed: null,
    validation: null,
  },
  [CONSTANTS.radioOption]: {
    visibility: null,
    computed: null,
    validation: null,
  },
  [CONSTANTS.addressLine2]: {
    visibility: null,
    computed: null,
    validation: null,
  },
  [CONSTANTS.city]: {
    visibility: null,
    computed: null,
    validation: null,
  },
  [CONSTANTS.state]: {
    visibility: null,
    computed: null,
    validation: null,
  },
  [CONSTANTS.zipcode]: {
    visibility: null,
    computed: null,
    validation: null,
  },
  [CONSTANTS.occupation]: {
    visibility: null,
    computed: null,
    validation: null,
  },
  [CONSTANTS.department]: {
    visibility: null,
    computed: null,
    validation: null,
  },
  [CONSTANTS.species]: {
    visibility: null,
    computed: null,
    validation: null,
  },
  [CONSTANTS.subSpecies]: {
    visibility: {
      callback: handleSubSpeciesVisibility,
      args: [CONSTANTS.species],
      visibleOnMount: false,
    },
    computed: null,
    validation: null,
  },
  [CONSTANTS.computedPrice]: {
    visibility: null,
    computed: {
      callback: computePriceFromQuantitySpecies,
      args: [CONSTANTS.numberOfFish, CONSTANTS.species],
    },
    validation: null,
  },
};

export { FORM_CONFIG, CONSTANTS };
