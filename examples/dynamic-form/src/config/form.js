const CONSTANTS = {
  fullName: "fullName",
  nickname: "nickname",
};

// if fullName exists in formData, return true so that nickname field displays
const handleNicknameVisibility = (args, formData) => {
  let data = args[0];
  if (!formData[data]) {
    return false;
  } else {
    return true;
  }
};

const FORM_CONFIG = {
  [CONSTANTS.nickname]: {
    visibility: {
      callback: handleNicknameVisibility,
      args: [CONSTANTS.fullName],
      visibleOnMount: false,
    },
    computed: null,
    validation: null,
  },
};

export { FORM_CONFIG, CONSTANTS, handleNicknameVisibility };
