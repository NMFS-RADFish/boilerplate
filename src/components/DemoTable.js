import { Table } from "@trussworks/react-uswds";
import { useTableState } from "../contexts/TableWrapper";
import { flexRender } from "@tanstack/react-table";

export const DemoTable = () => {
  const { tableCaption, table } = useTableState();

  if (!table) {
    return null;
  }

  return (
    <Table bordered caption={tableCaption || ""} fullWidth fixed>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
