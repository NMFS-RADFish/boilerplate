import { http, HttpResponse } from "msw";
import tripReportData from "../config/ReportTripType.json";
import tripReportDataClamLobster from "../config/ReportTripTypeClamLobster.json";
import activityData from "../config/Activity.json";
import inputsMetadata from "../config/InputsMetadata.json";
import speciesData from "../config/Species.json";
import tripTypesData from "../config/TripTypes.json";

export const MSW_ENDPOINT = {
  TRIP_REPORT: "/trip-report-type",
  TRIP_REPORT_CLAM_LOBSTER: "/trip-report-type-clam-lobster",
  ACTIVITY: "/activity",
  INPUTS_METADATA: "/inputs-metadata",
  SPECIES: "/species",
  TRIP_TYPES: "trip-types",
};

export const handlers = [
  http.get(MSW_ENDPOINT.TRIP_REPORT, () => {
    return HttpResponse.json(
      {
        data: tripReportData,
      },
      { status: 200 },
    );
  }),
  http.get(MSW_ENDPOINT.TRIP_REPORT_CLAM_LOBSTER, () => {
    return HttpResponse.json(
      {
        data: tripReportDataClamLobster,
      },
      { status: 200 },
    );
  }),
  http.get(MSW_ENDPOINT.ACTIVITY, () => {
    return HttpResponse.json(
      {
        data: activityData,
      },
      { status: 200 },
    );
  }),
  http.get(MSW_ENDPOINT.INPUTS_METADATA, () => {
    return HttpResponse.json(
      {
        data: inputsMetadata,
      },
      { status: 200 },
    );
  }),
  http.get(MSW_ENDPOINT.SPECIES, () => {
    return HttpResponse.json(
      {
        data: speciesData,
      },
      { status: 200 },
    );
  }),
  http.get(MSW_ENDPOINT.TRIP_TYPES, () => {
    return HttpResponse.json(
      {
        data: tripTypesData,
      },
      { status: 200 },
    );
  }),
];
