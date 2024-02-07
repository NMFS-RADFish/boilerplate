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

    if (!navigator.onLine) {
      const formData = new FormData();
      formData.append("timestamp", Date.now());

      for (let key in response) {
        formData.append(key, response[key]);
      }

      localStorage.getItem("formData")
        ? localStorage.setItem(
            "formData",
            JSON.stringify([
              ...JSON.parse(localStorage.getItem("formData")),
              Object.fromEntries(formData),
            ]),
          )
        : localStorage.setItem("formData", JSON.stringify([Object.fromEntries(formData)]));

      return HttpResponse.error(null, { status: 500 });
    } else {
      return HttpResponse.json({ data: response }, { status: 201 });
    }
  }),
];
