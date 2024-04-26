const CONSTANTS = {
  middleName: "middleName",
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

const handleSubSpeciesVisibility = (args, formData) => {
  for (let arg of args) {
    if (!formData[arg]) {
      return false;
    }
  }
  return true;
};

const handleNicknameVisibility = (args, formData) => {
  let data = args[0];
  if (!formData[data]) {
    return false;
  } else {
    return true;
  }
};

const handleCountryVisibility = (args, formData) => {
  let data = args[0];
  if (!formData[data]) {
    return false;
  } else {
    return true;
  }
};

const computePriceFromQuantitySpecies = (values) => {
  const speciesPriceMap = {
    grouper: 25.0,
    salmon: 58.0,
    marlin: 100.0,
    mahimahi: 44.0,
  };

  let computedPrice = parseInt(values[0] || 0) * parseInt(speciesPriceMap[values[1]] || 0);
  return computedPrice.toString();
};

const FORM_CONFIG = {
  [CONSTANTS.middleName]: {
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

export {
  FORM_CONFIG,
  CONSTANTS,
  handleSubSpeciesVisibility,
  handleNicknameVisibility,
  handleCountryVisibility,
  computePriceFromQuantitySpecies,
};
