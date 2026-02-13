import { describe, it, expect } from "vitest";
import { getDefaultConfig, deepMerge } from "./config.js";

describe("getDefaultConfig", () => {
  it("returns an object with expected top-level keys", () => {
    const config = getDefaultConfig();
    expect(config).toHaveProperty("app");
    expect(config).toHaveProperty("icons");
    expect(config).toHaveProperty("colors");
    expect(config).toHaveProperty("pwa");
    expect(config).toHaveProperty("typography");
  });

  it("returns default app values", () => {
    const config = getDefaultConfig();
    expect(config.app.name).toBe("RADFish Application");
    expect(config.app.shortName).toBe("RADFish");
    expect(config.app.description).toBe("RADFish React App");
  });

  it("returns default color values", () => {
    const config = getDefaultConfig();
    expect(config.colors.primary).toBe("#0054a4");
    expect(config.colors.secondary).toBe("#0093d0");
  });

  it("returns default pwa values", () => {
    const config = getDefaultConfig();
    expect(config.pwa.themeColor).toBe("#0054a4");
    expect(config.pwa.backgroundColor).toBe("#ffffff");
  });

  it("returns a new object on each call", () => {
    const config1 = getDefaultConfig();
    const config2 = getDefaultConfig();
    expect(config1).not.toBe(config2);
    expect(config1).toEqual(config2);
  });
});

describe("deepMerge", () => {
  it("merges flat objects", () => {
    const result = deepMerge({ a: 1, b: 2 }, { b: 3, c: 4 });
    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it("merges nested objects", () => {
    const source = { app: { name: "Default", version: "1.0" } };
    const target = { app: { name: "Custom" } };
    const result = deepMerge(source, target);
    expect(result.app.name).toBe("Custom");
    expect(result.app.version).toBe("1.0");
  });

  it("does not mutate source or target", () => {
    const source = { a: { b: 1 } };
    const target = { a: { c: 2 } };
    const result = deepMerge(source, target);
    expect(source).toEqual({ a: { b: 1 } });
    expect(target).toEqual({ a: { c: 2 } });
    expect(result).toEqual({ a: { b: 1, c: 2 } });
  });

  it("overwrites arrays instead of merging them", () => {
    const result = deepMerge({ a: [1, 2] }, { a: [3, 4] });
    expect(result.a).toEqual([3, 4]);
  });

  it("handles empty target", () => {
    const source = { a: 1, b: { c: 2 } };
    const result = deepMerge(source, {});
    expect(result).toEqual(source);
  });

  it("handles empty source", () => {
    const target = { a: 1, b: { c: 2 } };
    const result = deepMerge({}, target);
    expect(result).toEqual(target);
  });

  it("handles target overriding with null", () => {
    const result = deepMerge({ a: 1 }, { a: null });
    expect(result.a).toBeNull();
  });
});
