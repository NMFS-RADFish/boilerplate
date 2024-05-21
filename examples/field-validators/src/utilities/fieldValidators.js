const fullNameValidators = [
  {
    test: (value) => !/\d/.test(value) || value === "",
    message: "Full Name should not contain numbers.",
  },
];

export { fullNameValidators };
