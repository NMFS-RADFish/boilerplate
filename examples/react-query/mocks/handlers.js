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

export default [
  // Returns an array of fish species. This is currently being used to demonstrate populating a dropdown form component with "data" from a server
  // Note that this implementation can/should change depending on your needs
  http.get("/species", () => {
    return HttpResponse.json(
      {
        data: species,
      },
      { status: 200 },
    );
  }),
];
