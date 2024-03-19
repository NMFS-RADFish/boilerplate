/**
 * Component for displaying a demo table.
 * @returns {React.ReactNode} - The demo table component.
 */

import { useEffect } from "react";
import { useTableState } from "../contexts/TableWrapper";
import { MSW_ENDPOINT } from "../mocks/handlers";
import RadfishAPIService from "../services/APIService";
import {
  Table,
  TableBody,
  TableBodyRow,
  TableHeaderCell,
  TableHeader,
  TableHeaderRow,
  TableBodyCell,
  Button,
  TablePaginationNav,
  TablePaginationPageCount,
  TablePaginationGoToPage,
  TablePaginationSelectRowCount,
} from "../react-radfish";
import { useNavigate } from "react-router-dom";
import useOfflineStorage from "../hooks/useOfflineStorage";
import { Alert } from "@trussworks/react-uswds";

const ApiService = new RadfishAPIService("");

export const DemoTable = () => {
  /**
   * Retrieves table state from the context.
   * @type {object}
   * @property {string} tableCaption - Caption for the table.
   * @property {TableInstance} table - The React Table instance.
   * @property {Function} setData - Function to set table data. Useful for initializing data from cache or API endpoint
   */
  const {
    tableCaption,
    table,
    headerNames,
    rowModel,
    setData,
    showOfflineSubmit,
    setShowOfflineSubmit,
  } = useTableState();
  const navigate = useNavigate();

  const { findOfflineData } = useOfflineStorage();

  // Check if the app is offline
  // const isOffline = !navigator.onLine;

  /**
   * Fetches table data from the API service and sets it to the state in TableWrapper context.
   * Remember that DemoTable needs to be wrapped by a TableWrapper
   */
  useEffect(() => {
    const fetchFormData = async () => {
      const { data } = await ApiService.get(`${MSW_ENDPOINT.TABLE}?numberOfFish=0`);
      const newData = data.map((item) => ({ ...item, isOffline: false }));

      setData((prevData) => {
        // Get offline data
        const offlineData = findOfflineData();
        const offlineDataMapped = offlineData
          ? offlineData.map((entry) => ({ id: entry[0], ...entry[1], isOffline: true }))
          : [];
        // Combine offline data with new data and existing data
        const combinedData = [...offlineDataMapped, ...prevData, ...newData];
        // Remove duplicates
        const uniqueDataMap = Array.from(
          new Map(combinedData.map((item) => [item.id, item])).values(),
        );
        // Set the state with the unique data
        return uniqueDataMap;
      });

      // If there is offline data, show the submit draft button
      if (findOfflineData()) {
        setShowOfflineSubmit(true);
      }
    };

    fetchFormData();
  }, [setData, setShowOfflineSubmit]);

  /**
   * handleRowClick gets executed in the onClick handler on TableBodyRow
   * This can be useful for re-routing to a detail page, or handling other data specific functionality
   */
  const handleRowClick = (row) => {
    // row.original.id should be the id used when generating the form. this can come from MSW or alternatively from IndexDB/localStorage as needed when offline
    navigate(`/form/${row.original.id}`);
  };

  if (!table) {
    return null;
  }

  /**
   * This is a demo function that simulates the submission of offline data by removing the `isOffline` flag.
   * In a real application, you should make a POST request with the offline data to your server and then clear
   * the local storage or any state that holds this offline data.
   */

  const handleSubmitDraft = async (e, draftData) => {
    e.stopPropagation();
    e.preventDefault();
    if (!draftData) return;
    try {
      let response;
      if (draftData === "all") {
        // Handling the submission of all drafts
        response = await fetch("/species", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ all: true }),
        });
      } else {
        // Handling the submission of a single draft
        response = await fetch("/species", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(draftData),
        });
      }

      const responseData = await response.json();

      if (draftData === "all") {
        setData(responseData.data);
      } else {
        setData((prevData) => {
          const filteredData = prevData.filter((item) => item.id !== responseData.data[0].id);
          return [...filteredData, ...responseData.data]; // Add the single updated draft
        });
      }

      const existingDrafts = JSON.parse(localStorage.getItem("formData") || "[]");
      setShowOfflineSubmit(existingDrafts.length > 0);
    } catch (error) {
      console.error("Failed to submit draft:", error);
    }
  };

  return (
    <>
      <TableInfoAnnotation />
      <br />
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        {showOfflineSubmit ? (
          <>
            <Alert type="info" slim={true} className="maxw-mobile-lg">
              This button is used for submitting offline data to a server. It will only appear if
              offline data is found in either localStorage or indexedDB.
            </Alert>
            <Button style={{ marginLeft: "auto" }} onClick={(e) => handleSubmitDraft(e, "all")}>
              Submit Offline Data
            </Button>
          </>
        ) : (
          ""
        )}
        <Table bordered caption={tableCaption || ""} fullWidth fixed>
          <TableHeader table={table}>
            <TableHeaderRow table={table}>
              {headerNames.map((header) => {
                return <TableHeaderCell key={header.id} header={header} />;
              })}
            </TableHeaderRow>
          </TableHeader>
          <TableBody table={table}>
            {rowModel.rows.map((row) => {
              const isOfflineData = row.original.isOffline && !row.original.isSubmitted;
              const rowStyle = isOfflineData ? { backgroundColor: "lightgrey" } : {};
              return (
                <TableBodyRow
                  row={row}
                  onClick={() => handleRowClick(row)}
                  style={rowStyle}
                  key={row.original.id}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isStatusColumn = cell.column.id === "isOffline";
                    return (
                      <TableBodyCell
                        style={{ background: "transparent" }}
                        key={cell.id}
                        cell={cell}
                      >
                        {isStatusColumn && isOfflineData && (
                          <Button
                            onClick={(e) => handleSubmitDraft(e, row.original)}
                            style={{ fontSize: "14px", padding: "6px", marginLeft: "10%" }}
                          >
                            Submit
                          </Button>
                        )}
                      </TableBodyCell>
                    );
                  })}
                </TableBodyRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <Alert type="info" slim={true}>
        Below are examples of the different pagination components available. Each component is
        optional and can be used as needed. Components can be found in the `react-radfish`
        directory.
      </Alert>
      <div className="grid-container margin-bottom-3">
        <div className="grid-row display-flex tablet:flex-justify flex-align-center mobile-lg:display-flex flex-justify-center">
          <div className="width-mobile grid-col-auto display-flex flex-no-wrap">
            <TablePaginationNav
              setPageIndex={table.setPageIndex}
              previousPage={table.previousPage}
              nextPage={table.nextPage}
              getCanPreviousPage={table.getCanPreviousPage}
              getCanNextPage={table.getCanNextPage}
              getPageCount={table.getPageCount}
            />
          </div>
          <div className="grid-col-auto display-flex flex-wrap flex-align-center margin-y-1">
            <TablePaginationPageCount
              pageIndex={table.getState().pagination.pageIndex + 1}
              getPageCount={table.getPageCount}
            />
            <TablePaginationGoToPage
              pageIndex={table.getState().pagination.pageIndex + 1}
              setPageIndex={table.setPageIndex}
            />
            <TablePaginationSelectRowCount
              pageSize={table.getState().pagination.pageSize}
              setPageSize={table.setPageSize}
            />
          </div>
        </div>
      </div>
    </>
  );
};

function TableInfoAnnotation() {
  return (
    <Alert type="info" headingLevel={"h1"} heading="Table Components">
      Below is an example of a table that's populated by server and locally stored data
      (localStorage or indexedDB). The table is designed to be used with the `TableWrapper`
      component, it's built with{" "}
      <a href="https://react-table-v7-docs.netlify.app/" target="_blank" rel="noopener noreferrer">
        react-table
      </a>
      .
      <br />
      <br />
      Offline form data entries or "drafts" are highlighted in grey, and can be submitted to the
      server using the "submit" button in the "status" column when the application is connected to
      the internet.
      <br />
      <br />
      <strong>Note:</strong> Annotations are for informational purposes only. In production, you
      would remove the annotations. Components with annotations above them are optional. You can
      choose whether or not to use them in your application.
      <br />
      <br />
      <a
        href="https://www.notion.so/DRAFT-Work-in-progress-RADFish-Frontend-Application-Development-Guide-dc3c5589b019458e8b5ab3f4293ec183"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button type="button">Go To Documentation</Button>
      </a>
      <a
        href="https://main--65de4951379b5e4412b4ffbd.chromatic.com/?path=/docs/radfish-introduction--docs"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button type="button">Go To Storybook</Button>
      </a>
    </Alert>
  );
}
