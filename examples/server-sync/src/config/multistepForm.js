const CONSTANTS = {
  fullName: "fullName",
  nickname: "nickname",
  email: "email",
  phoneNumber: "phoneNumber",
  country: "country",
  city: "city",
  state: "state",
  zipcode: "zipcode",
};

const FORM_CONFIG = {
  [CONSTANTS.fullName]: {
    visibility: null,
    computed: null,
    validation: null,
  },
  [CONSTANTS.nickname]: {
    visibility: {
      callback: null,
      args: [],
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
      callback: null,
      args: [],
      visibleOnMount: false,
    },
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
};

export { FORM_CONFIG, CONSTANTS };
