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

const ApiService = new RadfishAPIService("");

export const DemoTable = () => {
  const { tableCaption, table, setData } = useTableState();
  const headerGroup = table.getHeaderGroups();
  const rowModel = table.getRowModel();

  // Check if the app is offline
  const isOffline = !navigator.onLine;

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
            <TableBodyRow row={row}>
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
