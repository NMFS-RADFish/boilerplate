import { useEffect } from "react";
import { Table } from "@trussworks/react-uswds";
import { useTableState } from "../contexts/TableWrapper";
import { flexRender } from "@tanstack/react-table";
import { MSW_ENDPOINT } from "../mocks/handlers";
import RadfishAPIService from "../services/APIService";

const ApiService = new RadfishAPIService("");

export const DemoTable = () => {
  const { tableCaption, table, setData } = useTableState();

  // Check if the app is offline
  const isOffline = !navigator.onLine;

  useEffect(() => {
    if (isOffline) {
      return;
    }
    const fetchFormData = async () => {
      const { data } = await ApiService.get(MSW_ENDPOINT.TABLE);
      setData(data);
    };
    fetchFormData();
  }, [isOffline]);

  if (!table) {
    return null;
  }

  return (
    <Table bordered caption={tableCaption || ""} fullWidth fixed>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: header.column.getCanSort() ? "cursor-pointer select-none" : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  )}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table
          .getRowModel()
          .rows.slice(0, 10)
          .map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
};
