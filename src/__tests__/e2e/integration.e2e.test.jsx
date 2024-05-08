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

    await page.waitForSelector("#fullName");
    const value = await page.$eval("#fullName", (el) => el.outerHTML);

    expect(value).toBe(
      `<input data-testid="inputId" class="usa-input radfish-input " id="fullName" name="fullName" type="text" placeholder="Full Name" aria-invalid="false" value="">`,
    );
  });

  afterAll(() => browser.close());
});
