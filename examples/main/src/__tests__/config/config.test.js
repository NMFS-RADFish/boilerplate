import { CONSTANTS, FORM_CONFIG } from "../../config/form.js";

describe("Form Config", () => {
  // Full Name Validator Tests
  test("For every CONSTANT, there should be a FORM_CONFIG object", () => {
    expect(Object.entries(CONSTANTS).length).toBe(Object.entries(FORM_CONFIG).length);
  });

  test("For every FORM_CONFIG object, if not null, there should be at _minimum_ a callback and and args property.", () => {
    const entries = Object.entries(FORM_CONFIG).map((entry) => entry[1]);

    const configObjs = [];
    for (let entry of entries) {
      for (let key in entry) {
        if (entry[key] !== null) {
          configObjs.push(entry[key]);
        }
      }
    }

    let result = true;
    for (let config of configObjs) {
      if (!Object.keys(config).includes("callback") || !Object.keys(config).includes("args")) {
        result = false;
        break;
      }
    }

    expect(result).toBe(true);
  });
});
