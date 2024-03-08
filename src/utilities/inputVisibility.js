export const handleInputVisibilityLogic = (inputIds, formData, FORM_CONFIG) => {
  const inputVisibility = {};

  inputIds.forEach((inputId) => {
    const visibilityCallback = FORM_CONFIG[inputId]?.visibility?.callback;
    if (visibilityCallback) {
      const args = FORM_CONFIG[inputId].visibility.args;
      let result = visibilityCallback(args, formData);
      inputVisibility[inputId] = result;
      // whenever a form disappears, remove its value from formData
      // this prevents non-visible fields from being submitted
      if (result === false) {
        formData[inputId] = ""; // Update the form data directly
      }
    }
  });

  return inputVisibility;
};

export const handleSubSpeciesVisibility = (args, formData) => {
  for (let arg of args) {
    if (!formData[arg]) {
      return false;
    }
  }
  return true;
};

export const handleNicknameVisibility = (args, formData) => {
  let data = args[0];
  if (!formData[data]) {
    return false;
  } else {
    return true;
  }
};

export const handleCountryVisibility = (args, formData) => {
  let data = args[0];
  if (!formData[data]) {
    return false;
  } else {
    return true;
  }
};
