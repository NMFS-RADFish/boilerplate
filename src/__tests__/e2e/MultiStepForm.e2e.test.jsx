import puppeteer from "puppeteer";

describe("MultiStepForm", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  it("navigate through steps, ensure it can progress from initial page to first step", async () => {
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
