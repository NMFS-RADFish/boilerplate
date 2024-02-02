import React, { createContext } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();
const TableContext = createContext();

export const TableWrapper = ({ children }) => {
  const [data, setData] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("documentTitle", {
        cell: (info) => info.getValue(),
        header: () => <span>Document Title</span>,
      }),
      columnHelper.accessor("year", {
        cell: (info) => info.getValue(),
        header: () => <span>Year Created</span>,
      }),
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const contextValue = {
    tableCaption: "This table uses the fixed prop to force equal width columns",
    table,
    setData,
  };

  return <TableContext.Provider value={contextValue}>{children}</TableContext.Provider>;
};

export const useTableState = () => {
  const context = React.useContext(TableContext);
  if (!context) {
    throw new Error("useTableState must be used within a TableWrapper");
  }
  return context;
};
