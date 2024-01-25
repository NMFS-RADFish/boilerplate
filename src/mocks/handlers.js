import { http, HttpResponse } from "msw";

export const MSW_ENDPOINT = {
  SPECIES: "/species",
};

export const handlers = [
  http.get(MSW_ENDPOINT.SPECIES, () => {
    return HttpResponse.json({ data: ["grouper", "salmon"] }, { status: 200 });
  }),
  http.post(MSW_ENDPOINT.SPECIES, async ({ request }) => {
    const response = await request.json();
    return HttpResponse.json({ data: response }, { status: 201 });
  }),
];
