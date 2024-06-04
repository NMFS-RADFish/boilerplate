import { http, HttpResponse } from "msw";
import { computePriceFromQuantitySpecies } from "../config/form";

export const MSW_ENDPOINT = {
  SPECIES: "/species",
  TABLE: "/table",
  FORM: "/form",
  HOMEBASE: "/homebase",
};

const data = [
  {
    uuid: "ca6365fe-4eb5-4c5c-a1d3-df3a7edbe69f",
    fullName: "",
    species: "grouper",
    numberOfFish: 0,
    email: "",
    phoneNumber: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipcode: "",
    occupation: "",
    department: "",
    computedPrice: 0,
    isDraft: true,
    currentStep: 1,
  },
  {
    uuid: "5f56f849-7aed-4d81-9eef-10db110ec95b",
    fullName: "",
    species: "salmon",
    numberOfFish: 0,
    email: "",
    phoneNumber: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipcode: "",
    occupation: "",
    department: "",
    computedPrice: 0,
    isDraft: false,
    currentStep: 1,
  },
  {
    uuid: "ae16b984-5e01-407c-8c27-9e43f109328f",
    fullName: "",
    species: "marlin",
    numberOfFish: 0,
    email: "",
    phoneNumber: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipcode: "",
    occupation: "",
    department: "",
    computedPrice: 0,
    isDraft: true,
    currentStep: 1,
  },
  {
    uuid: "15eac339-343d-4c09-a23d-7906f4cc0062",
    fullName: "",
    species: "mahimahi",
    numberOfFish: 0,
    email: "",
    phoneNumber: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipcode: "",
    occupation: "",
    computedPrice: 0,
    isDraft: true,
    currentStep: 1,
  },
];

const homebase = [
  {
    VALUE: "Lobster - Commercial",
    KEY: 9,
    REPORT_TYPE: 2,
    TRIP_TYPE: 1,
    SORT_KEY: 0,
    DEFAULT_UOM: "LBS",
    DEFAULT_SPECIES_UOM: "LBS",
  },
  {
    VALUE: "Clam ITQ - Commercial",
    KEY: 7,
    SORT_KEY: 1,
    REPORT_TYPE: 3,
    TRIP_TYPE: 1,
    DEFAULT_UOM: "BU",
    DEFAULT_SPECIES_UOM: "LBS",
  },
  {
    VALUE: "Commercial",
    KEY: 1,
    REPORT_TYPE: 1,
    TRIP_TYPE: 1,
    SORT_KEY: 2,
    DEFAULT_UOM: "LBS",
    DEFAULT_SPECIES_UOM: "LBS",
  },
  {
    VALUE: "Party",
    KEY: 2,
    REPORT_TYPE: 1,
    TRIP_TYPE: 2,
    SORT_KEY: 3,
    DEFAULT_UOM: "CNT",
    DEFAULT_SPECIES_UOM: "CNT",
  },
  {
    VALUE: "Lobster - Charter",
    KEY: 8,
    REPORT_TYPE: 2,
    TRIP_TYPE: 3,
    SORT_KEY: 4,
    DEFAULT_UOM: "CNT",
    DEFAULT_SPECIES_UOM: "CNT",
  },
  {
    VALUE: "Charter",
    KEY: 3,
    REPORT_TYPE: 1,
    TRIP_TYPE: 3,
    SORT_KEY: 5,
    DEFAULT_UOM: "CNT",
    DEFAULT_SPECIES_UOM: "CNT",
  },
  {
    VALUE: "Private Recreational - Private use of a federally permitted vessel",
    KEY: 6,
    REPORT_TYPE: 1,
    TRIP_TYPE: 6,
    SORT_KEY: 6,
    DEFAULT_UOM: "CNT",
    DEFAULT_SPECIES_UOM: "CNT",
  },
];

export const species = [
  { name: "grouper", price: 25.0 },
  { name: "salmon", price: 58.0 },
  { name: "marlin", price: 100.0 },
  { name: "mahimahi", price: 44.0 },
];

export const handlers = [
  // This handler is used to mock the response of a GET request for an SVG or WOFF2 file
  http.get(/\.(svg|woff2)$/, async () => {
    return;
  }),

  http.post(MSW_ENDPOINT.FORM, async ({ request }) => {
    let { formData } = await request.json();
    Object.assign(formData, { isDraft: false });
    return HttpResponse.json({ data: formData }, { status: 201 });
  }),

  // Returns an array of fish species. This is currently being used to demonstrate populating a dropdown form component with "data" from a server
  // Note that this implementation can/should change depending on your needs
  http.get(MSW_ENDPOINT.SPECIES, () => {
    return HttpResponse.json(
      {
        data: species,
      },
      { status: 200 },
    );
  }),
  // This endpoint simply returns the data that is submitted to from a form
  // In a full stack implementation, there will likely be some logic on the server to handle/store persistent data
  http.post(MSW_ENDPOINT.SPECIES, async ({ request }) => {
    const response = await request.json();

    if (!navigator.onLine) {
      return HttpResponse.error(null, { status: 500 });
    } else {
      let modifiedResponses = [];
      const responseData = response.body;

      responseData.forEach((data) => {
        const modifiedResponse = { ...data, isOffline: false };
        modifiedResponses.push(modifiedResponse);
      });
      data.push(...modifiedResponses);

      return HttpResponse.json({ data: modifiedResponses }, { status: 201 });
    }
  }),
  // this endpoint is meant to return data to populate a RADFishForm state.
  // ReactTable expects an array of objects, where the key of each object represent a column header value
  // Each object also represent a row in the table.
  // The values of each object represents the cell value of the corresponding column in the row
  http.get(MSW_ENDPOINT.TABLE, ({ request }) => {
    const url = new URL(request.url);
    const minAmount = url.searchParams.get("amount");

    let returnData = data;

    // leverage the URL query param `?amount=<number>` to mock sever side logic and only returned filtered data to client
    // note that this is an implementation that is expected to be implemented server side, not on the client
    if (minAmount) {
      returnData = data.filter((data) => data.count > minAmount);
    }

    return HttpResponse.json(
      {
        data: returnData,
      },
      { status: 200 },
    );
  }),

  // endpoint to return a form's prepopulated data based on it's uuid. this returns a mock server response.
  // note that locally cached data and server provided data can often be out of sync.
  http.get("/form/:id", ({ params }) => {
    const [mockData] = data.filter((obj) => obj.id === params.id);

    if (!mockData) {
      return HttpResponse.json({}, { status: 500 });
    }

    const returnData = {
      id: mockData.id,
      fullName: "John Smith",
      email: "john@noaa.com",
      city: "Honolulu",
      phoneNumber: "1112223333",
      numberOfFish: mockData.numberOfFish,
      species: mockData.species,
      computedPrice: computePriceFromQuantitySpecies([mockData.numberOfFish, mockData.species]),
    };
    return HttpResponse.json(
      {
        data: returnData,
      },
      { status: 200 },
    );
  }),

  http.get("/homebase", ({ params }) => {
    return HttpResponse.json(
      {
        data: homebase,
      },
      { status: 200 },
    );
  }),
];
