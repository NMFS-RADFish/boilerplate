import puppeteer from "puppeteer";

describe("Integration", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  it("should be able to navigate through application", async () => {
    await page.goto("http://localhost:3000/form");
    await page.waitForSelector("#step-forward");
    await page.click("#step-forward");

    await page.waitForSelector("#species");
    const value = await page.$eval("#species", (el) => el.outerHTML);

    expect(value).toBe(
      `<select data-testid="Select" class="usa-select radfish-select " id="species" name="species" linkedinputids="computedPrice,subSpecies"><option value="">Select Species</option><option value="grouper">Grouper</option><option value="salmon">Salmon</option><option value="marlin">Marlin</option><option value="mahimahi">Mahimahi</option></select>`,
    );
  });

  afterAll(() => browser.close());
});
