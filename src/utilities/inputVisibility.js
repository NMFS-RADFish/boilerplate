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
