import { http, HttpResponse } from "msw";

export default [
  http.get("/status", ({ request }) => {
    return HttpResponse.json(
      {
        message: "OK",
      },
      { status: 200 },
    );
  }),
];
