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
  const { tableCaption, table, headerGroup, rowModel, setData } = useTableState();
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
    if (store) {
      setOfflineData();
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
  }, [store]);

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
        return { id: entry[0], ...entry[1], isOffline: true };
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

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      <Button style={{ marginLeft: "auto" }} onClick={handleSubmitOfflineData}>
        Submit Offline Data
      </Button>
      <Table bordered caption={tableCaption || ""} fullWidth fixed>
        <TableHeader table={table}>
          <TableHeaderRow table={table}>
            {headerGroup.map((group) =>
              group.headers.map((header) => {
                return <TableHeaderCell header={header} />;
              }),
            )}
          </TableHeaderRow>
        </TableHeader>
        <TableBody table={table}>
          {rowModel.rows.map((row) => {
            const isOfflineData = row.original.isOffline && !row.original.isSubmitted;
            const rowStyle = isOfflineData ? { backgroundColor: "lightgrey", cursor: "auto" } : {};
            return (
              <TableBodyRow row={row} onClick={() => handleRowClick(row)} style={rowStyle}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableBodyCell
                      style={{ background: "transparent" }}
                      isOfflineData={isOfflineData}
                      cell={cell}
                    />
                  );
                })}
              </TableBodyRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
