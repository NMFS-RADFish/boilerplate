import { http, HttpResponse } from "msw";

export const MSW_ENDPOINT = {
  SPECIES: "/species",
};

export const species = [
  { name: "Grouper", price: 25.0 },
  { name: "Mahimahi", price: 44.0 },
  { name: "Salmon", price: 58.0 },
  { name: "Marlin", price: 100.0 },
];

export const handlers = [
  // Returns an array of fish species. This is currently being used to demonstrate populating a dropdown form component with "data" from a server
  // Note that this implementation can/should change depending on your needs
  http.get(MSW_ENDPOINT.SPECIES, () => {
    return HttpResponse.json(
      {
        data: species,
      },
      { status: 200 },
    );
  }),
  // This endpoint simply returns the data that is submitted to from a form
  // In a full stack implementation, there will likely be some logic on the server to handle/store persistent data
  http.post(MSW_ENDPOINT.SPECIES, async ({ request }) => {
    const requestData = await request.json();
    const response = [requestData.data, ...species];

    return HttpResponse.json({ data: response }, { status: 201 });
  }),
];