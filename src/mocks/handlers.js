import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/species", () => {
    return HttpResponse.json({ data: ["grouper", "marlin"] }, { status: 200 });
  }),
];
