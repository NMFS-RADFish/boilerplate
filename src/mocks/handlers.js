import { http, HttpResponse } from "msw";
import tripReportData from "../config/ReportTripType.json";
import tripReportDataClamLobster from "../config/ReportTripTypeClamLobster.json";

export const MSW_ENDPOINT = {
  TRIP_REPORT: "/trip-report-type",
  TRIP_REPORT_CLAM_LOBSTER: "/trip-report-type-clam-lobster",
};

export const handlers = [
  http.get(MSW_ENDPOINT.TRIP_REPORT, ({ request }) => {
    const url = new URL(request.url);

    return HttpResponse.json(
      {
        data: tripReportData,
      },
      { status: 200 },
    );
  }),
  http.get(MSW_ENDPOINT.TRIP_REPORT_CLAM_LOBSTER, ({ request }) => {
    const url = new URL(request.url);

    return HttpResponse.json(
      {
        data: tripReportDataClamLobster,
      },
      { status: 200 },
    );
  }),
];
