import { http, HttpResponse } from "msw";

export const MSW_ENDPOINT = {
  SPECIES: "/species",
  TABLE: "/table",
};

export const handlers = [
  http.get(MSW_ENDPOINT.SPECIES, () => {
    return HttpResponse.json({ data: ["grouper", "salmon"] }, { status: 200 });
  }),
  http.post(MSW_ENDPOINT.SPECIES, async ({ request }) => {
    const response = await request.json();
    return HttpResponse.json({ data: response }, { status: 201 });
  }),
  http.get(MSW_ENDPOINT.TABLE, () => {
    return HttpResponse.json(
      {
        data: [
          {
            documentTitle: "Declaration of Independence",
            year: "1776",
          },
          {
            documentTitle: "Bill of Rights",
            year: "1791",
          },
          {
            documentTitle: "Declaration of Sentiments",
            year: "1848",
          },
          {
            documentTitle: "Emancipation Proclamation",
            year: "1863",
          },
        ],
      },
      { status: 200 },
    );
  }),
];
