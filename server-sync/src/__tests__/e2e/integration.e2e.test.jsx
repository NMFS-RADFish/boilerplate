import puppeteer from "puppeteer";

describe("Integration", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  it("should be able to navigate through application", async () => {
    console.log(
      JSON.stringify({
        name: import.meta.env.VITE_INDEXED_DB_NAME,
        version: import.meta.env.VITE_INDEXED_DB_VERSION,
      }),
    );
    await page.goto("http://localhost:3000/multistep");
    await page.waitForSelector("#step-forward");
    await page.click("#step-forward");

    await page.waitForSelector("#fullName");
    const value = await page.$eval("#fullName", (el) => el.outerHTML);

    expect(value).toBe(
      `<input data-testid="textInput" class="usa-input radfish-input " id="fullName" name="fullName" type="text" placeholder="Full Name" aria-invalid="false" linkedinputids="nickname" value="">`,
    );
  });

  afterAll(() => browser.close());
});
