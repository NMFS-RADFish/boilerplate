import { http, HttpResponse } from "msw";

export const MSW_ENDPOINT = {
  HOMEBASE: "/homebase",
};

const homebase = [
  {
    uuid: "15eac339-343d-4c09-a23d-7906f4cc0062",
    VALUE: "Lobster - Commercial",
    KEY: 9,
    REPORT_TYPE: 2,
    TRIP_TYPE: 1,
    SORT_KEY: 0,
    DEFAULT_UOM: "LBS",
    DEFAULT_SPECIES_UOM: "LBS",
  },
  {
    uuid: "15eac339-343d-4c09-a23d-7906f4cc0064",
    VALUE: "Clam ITQ - Commercial",
    KEY: 7,
    SORT_KEY: 1,
    REPORT_TYPE: 3,
    TRIP_TYPE: 1,
    DEFAULT_UOM: "BU",
    DEFAULT_SPECIES_UOM: "LBS",
  },
  {
    uuid: "15eac339-343d-4c09-a23d-790624cc0062",
    VALUE: "Commercial",
    KEY: 1,
    REPORT_TYPE: 1,
    TRIP_TYPE: 1,
    SORT_KEY: 2,
    DEFAULT_UOM: "LBS",
    DEFAULT_SPECIES_UOM: "LBS",
  },
  {
    uuid: "15eac339-343d-4c09-a23d-7906f22c0062",
    VALUE: "Party",
    KEY: 2,
    REPORT_TYPE: 1,
    TRIP_TYPE: 2,
    SORT_KEY: 3,
    DEFAULT_UOM: "CNT",
    DEFAULT_SPECIES_UOM: "CNT",
  },
  {
    uuid: "15eac339-343d-4c09-a23d-7906f4cc2262",
    VALUE: "Lobster - Charter",
    KEY: 8,
    REPORT_TYPE: 2,
    TRIP_TYPE: 3,
    SORT_KEY: 4,
    DEFAULT_UOM: "CNT",
    DEFAULT_SPECIES_UOM: "CNT",
  },
  {
    uuid: "15eac339-343d-4c09-a23d-790214cc0062",
    VALUE: "Charter",
    KEY: 3,
    REPORT_TYPE: 1,
    TRIP_TYPE: 3,
    SORT_KEY: 5,
    DEFAULT_UOM: "CNT",
    DEFAULT_SPECIES_UOM: "CNT",
  },
  {
    uuid: "15eac339-343d-4c09-a23d-7906f22c0062",
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
  http.get("/homebase", () => {
    return HttpResponse.json(
      {
        data: homebase,
      },
      { status: 200 },
    );
  }),
];
