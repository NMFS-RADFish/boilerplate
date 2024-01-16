import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/species", () => {
    return HttpResponse.json({ data: ["grouper", "marlin"] }, { status: 200 });
  }),
  http.post("/species", async ({ request }) => {
    const response = await request.json();
    return HttpResponse.json({ data: response }, { status: 201 });
  }),
];
