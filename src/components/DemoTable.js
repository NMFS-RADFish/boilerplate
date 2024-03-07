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
import useFormStorage from "../hooks/useFormStorage";

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
    data,
    showOfflineSubmit,
    setShowOfflineSubmit,
  } = useTableState();
  const navigate = useNavigate();

  const { store } = useFormStorage();

  // Check if the app is offline
  // const isOffline = !navigator.onLine;

  /**
   * Fetches table data from the API service and sets it to the state in TableWrapper context.
   * Remember that DemoTable needs to be wrapped by a TableWrapper
   * If app is offline, do not fetch. TODO: This should getch data from cache
   */
  useEffect(() => {
    if (store && store.length) {
      setOfflineData();
      setShowOfflineSubmit(true);
    }
    const fetchFormData = async () => {
      const { data } = await ApiService.get(`${MSW_ENDPOINT.TABLE}?numberOfFish=0`);
      setData((prevData) => {
        const newData = data.map((item) => ({ ...item, isOffline: false }));
        const combinedData = [...prevData, ...newData];
        const uniqueData = Array.from(
          new Map(combinedData.map((item) => [item.id, item])).values(),
        );
        return uniqueData;
      });
    };

    fetchFormData();
  }, [store, setData]);

  /**
   * handleRowClick gets executed in the onClick handler on TableBodyRow
   * This can be useful for re-routing to a detail page, or handling other data specific functionality
   */
  const handleRowClick = (row) => {
    if (row.original.isOffline) return;
    // row.original.id should be the id used when generating the form. this can come from MSW or alternatively from IndexDB/localStorage as needed when offline
    navigate(`/form/${row.original.id}`);
  };

  if (!table) {
    return null;
  }

  const setOfflineData = () => {
    setData(
      store.map((entry) => {
        return {
          id: entry[0],
          ...entry[1],
          isOffline: true,
          onClick: () => handleSubmitDraft(data),
        };
      }),
    );
  };

  /**
   * This is a demo function that simulates the submission of offline data by removing the `isOffline` flag.
   * In a real application, you should make a POST request with the offline data to your server and then clear
   * the local storage or any state that holds this offline data.
   */

  const handleSubmitOfflineData = () => {
    setData((prevData) => {
      // Remove the `isOffline` property from all items
      const updatedData = prevData.map((item) => {
        if (item.isOffline) {
          return { ...item, isSubmitted: true };
        }
        return item;
      });
      return updatedData;
    });
  };

  const handleSubmitDraft = async (draftData) => {
    if (!draftData) return;
    try {
      // Replace with the actual API call to submit the draft data
      console.log(draftData, "data");
      const response = await fetch("/species", {
        method: "POST",
        // headers: setHeaders(this.token),
        body: JSON.stringify({
          ...draftData,
        }),
      });

      const { data } = await response.json(); // This is the modifiedResponse from your backend
      console.log(data, "datatata");

      setData((prevData) => {
        // Remove the old draft based on its id and add the updated one
        const newData = prevData.filter((item) => item.id !== data.id); // Assuming `id` is the unique identifier
        newData.push(data); // Add the updated draft
        return newData;
      });
      console.log(store, "stpore in submit");
      const existingDrafts = JSON.parse(localStorage.getItem("formData") || "[]");
      setShowOfflineSubmit(existingDrafts.length);
    } catch (error) {
      console.error("Failed to submit draft:", error);
    }
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        {showOfflineSubmit ? (
          <Button style={{ marginLeft: "auto" }} onClick={handleSubmitOfflineData}>
            Submit Offline Data
          </Button>
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
              const rowStyle = isOfflineData
                ? { backgroundColor: "lightgrey", cursor: "auto" }
                : {};
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
                            onClick={() => handleSubmitDraft(row.original)}
                            style={{ fontSize: "14px", padding: "6px", marginLeft: "auto" }}
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
