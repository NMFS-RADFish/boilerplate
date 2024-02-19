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
} from "../react-radfish";
import { useNavigate } from "react-router-dom";

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

  // Check if the app is offline
  const isOffline = !navigator.onLine;

  /**
   * Fetches table data from the API service and sets it to the state in TableWrapper context.
   * Remember that DemoTable needs to be wrapped by a TableWrapper
   * If app is offline, do not fetch. TODO: This should getch data from cache
   */
  useEffect(() => {
    if (isOffline) {
      return;
    }
    const fetchFormData = async () => {
      const { data } = await ApiService.get(`${MSW_ENDPOINT.TABLE}?amount=0`);
      setData(data);
    };
    fetchFormData();
  }, [isOffline]);

  /**
   * handleRowClick gets executed in the onClick handler on TableBodyRow
   * This can be useful for re-routing to a detail page, or handling other data specific functionality
   */
  const handleRowClick = (row) => {
    // row.original.id should be the id used when generating the form. this can come from MSW or alternatively from IndexDB/localStorage as needed when offline
    navigate(`/detail/${row.original.id}`);
  };

  if (!table) {
    return null;
  }

  return (
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
          return (
            <TableBodyRow row={row} onClick={() => handleRowClick(row)}>
              {row.getVisibleCells().map((cell) => {
                return <TableBodyCell cell={cell} />;
              })}
            </TableBodyRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
