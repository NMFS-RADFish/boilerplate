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
    id: "507ff846-573d-40e9-9996-c458c34b4643",
    species: "grouper",
    numberOfFish: 10,
  },
  {
    id: "967ec4e7-1e96-452d-a9bc-79f60f64a6fd",
    species: "salmon",
    numberOfFish: 5,
  },
  {
    id: "7e96975b-e1a1-48ed-bad6-15cb780d99cb",
    species: "marlin",
    numberOfFish: 1,
  },
  {
    id: "3037d796-cf4d-4274-ab2d-f7c80d8c0fa3",
    species: "mahimahi",
    numberOfFish: 15,
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

export const handlers = [
  // This handler is used to mock the response of a GET request for an SVG or WOFF2 file
  http.get(/\.(svg|woff2)$/, async () => {
    return;
  }),

  http.post(MSW_ENDPOINT.FORM, ({ request }) => {
    return HttpResponse.json({ data: request.body }, { status: 201 });
  }),

  // Returns an array of fish species. This is currently being used to demonstrate populating a dropdown form component with "data" from a server
  // Note that this implementation can/should change depending on your needs
  http.get(MSW_ENDPOINT.SPECIES, () => {
    return HttpResponse.json(
      { data: ["grouper", "salmon", "marlin", "mahimahi"] },
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
  // this endpoint is meant to return data to populate a RadfishForm state.
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
