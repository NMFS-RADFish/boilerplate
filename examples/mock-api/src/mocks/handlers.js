import { http, HttpResponse } from "msw";

export const MSW_ENDPOINT = {
  SPECIES: "/species",
};

export const species = [
  { name: "grouper", price: 25.0, src: "./sample-img.webp" },
  { name: "salmon", price: 58.0, src: "./sample-img.webp" },
  { name: "marlin", price: 100.0, src: "./sample-img.webp" },
  { name: "mahimahi", price: 44.0, src: "./sample-img.webp" },
];

export const handlers = [
  // GET endpoint: Fetch list of species
  // Note that this implementation can/should change depending on your needs
  http.get(MSW_ENDPOINT.SPECIES, () => {
    return HttpResponse.json(
      {
        data: species,
      },
      { status: 200 }
    );
  }),
  // POST endpoint: Add a new species

  // In a full stack implementation, there will likely be some logic on the server to handle/store persistent data
  http.post(MSW_ENDPOINT.SPECIES, async ({ request }) => {
    const requestData = await request.json();
    const response = [requestData.formData, ...species];

    return HttpResponse.json({ data: response }, { status: 201 });
  }),
];
