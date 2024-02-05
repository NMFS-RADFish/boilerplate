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
  http.get(MSW_ENDPOINT.TABLE, ({ request }) => {
    const url = new URL(request.url);
    const minAmount = url.searchParams.get("amount");

    const data = [
      {
        species: "Grouper",
        count: 10,
      },
      {
        species: "Salmon",
        count: 5,
      },
      {
        species: "Marlin",
        count: 1,
      },
      {
        species: "Mahimahi",
        count: 15,
      },
    ];

    let returnData = data;

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
];
