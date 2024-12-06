import { http, HttpResponse } from "msw";
import { serverData } from "./mockdata";

export const MSW_ENDPOINT = {
  GET: "/getData",
};

export const handlers = [
  http.get(MSW_ENDPOINT.GET, () => {
    return HttpResponse.json(
      {
        data: serverData,
      },
      { status: 200 },
    );
  }),
];
