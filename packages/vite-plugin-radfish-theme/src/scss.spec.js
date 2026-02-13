import { describe, it, expect } from "vitest";
import { parseScssContent, isUswdsToken, formatUswdsValue, normalizeColorValue } from "./scss.js";

describe("parseScssContent", () => {
  it("parses simple SCSS variable definitions", () => {
    const content = `$primary: #0054a4;\n$secondary: #0093d0;`;
    const result = parseScssContent(content);
    expect(result.primary).toBe("#0054a4");
    expect(result.secondary).toBe("#0093d0");
  });

  it("converts kebab-case to camelCase", () => {
    const content = `$base-lightest: gray-5;`;
    const result = parseScssContent(content);
    expect(result.baseLightest).toBe("gray-5");
  });

  it("strips !default flag", () => {
    const content = `$primary: blue-60v !default;`;
    const result = parseScssContent(content);
    expect(result.primary).toBe("blue-60v");
  });

  it("handles quoted values", () => {
    const content = `$primary: 'blue-60v';`;
    const result = parseScssContent(content);
    expect(result.primary).toBe("'blue-60v'");
  });

  it("returns empty object for empty content", () => {
    const result = parseScssContent("");
    expect(result).toEqual({});
  });

  it("ignores comments and non-variable lines", () => {
    const content = `// This is a comment\n.class { color: red; }\n$primary: #000;`;
    const result = parseScssContent(content);
    expect(Object.keys(result)).toEqual(["primary"]);
    expect(result.primary).toBe("#000");
  });

  it("handles indented variable definitions", () => {
    const content = `  $primary: #0054a4;`;
    const result = parseScssContent(content);
    expect(result.primary).toBe("#0054a4");
  });

  it("handles multiple variables with mixed types", () => {
    const content = `
$primary: blue-60v;
$secondary: #0093d0;
$base-lightest: gray-cool-5;
$accent-warm: orange-30v;
`;
    const result = parseScssContent(content);
    expect(result.primary).toBe("blue-60v");
    expect(result.secondary).toBe("#0093d0");
    expect(result.baseLightest).toBe("gray-cool-5");
    expect(result.accentWarm).toBe("orange-30v");
  });
});

describe("normalizeColorValue", () => {
  it("strips single quotes", () => {
    expect(normalizeColorValue("'blue-60v'")).toBe("blue-60v");
  });

  it("strips double quotes", () => {
    expect(normalizeColorValue('"blue-60v"')).toBe("blue-60v");
  });

  it("returns unquoted values unchanged", () => {
    expect(normalizeColorValue("#0054a4")).toBe("#0054a4");
  });
});

describe("isUswdsToken", () => {
  it("recognizes basic color tokens", () => {
    expect(isUswdsToken("blue")).toBe(true);
    expect(isUswdsToken("red")).toBe(true);
    expect(isUswdsToken("green")).toBe(true);
    expect(isUswdsToken("gray")).toBe(true);
    expect(isUswdsToken("black")).toBe(true);
    expect(isUswdsToken("white")).toBe(true);
  });

  it("recognizes tokens with grade", () => {
    expect(isUswdsToken("blue-60")).toBe(true);
    expect(isUswdsToken("red-50")).toBe(true);
    expect(isUswdsToken("gray-5")).toBe(true);
  });

  it("recognizes tokens with vivid grade", () => {
    expect(isUswdsToken("blue-60v")).toBe(true);
    expect(isUswdsToken("red-50v")).toBe(true);
  });

  it("recognizes tokens with modifier", () => {
    expect(isUswdsToken("gray-cool-30")).toBe(true);
    expect(isUswdsToken("gray-warm-50")).toBe(true);
    expect(isUswdsToken("red-vivid")).toBe(true);
  });

  it("recognizes tokens with modifier and vivid grade", () => {
    expect(isUswdsToken("mint-cool-40v")).toBe(true);
    expect(isUswdsToken("green-cool-40v")).toBe(true);
  });

  it("rejects hex colors", () => {
    expect(isUswdsToken("#0054a4")).toBe(false);
    expect(isUswdsToken("#fff")).toBe(false);
  });

  it("rejects arbitrary strings", () => {
    expect(isUswdsToken("primary")).toBe(false);
    expect(isUswdsToken("some-random-value")).toBe(false);
  });
});

describe("formatUswdsValue", () => {
  it("quotes USWDS token values", () => {
    expect(formatUswdsValue("blue-60v")).toBe("'blue-60v'");
    expect(formatUswdsValue("gray-cool-30")).toBe("'gray-cool-30'");
  });

  it("leaves hex values unquoted", () => {
    expect(formatUswdsValue("#0054a4")).toBe("#0054a4");
    expect(formatUswdsValue("#fff")).toBe("#fff");
  });

  it("strips quotes before checking token", () => {
    expect(formatUswdsValue("'blue-60v'")).toBe("'blue-60v'");
  });

  it("leaves non-token non-hex values unquoted", () => {
    expect(formatUswdsValue("primary")).toBe("primary");
  });
});
