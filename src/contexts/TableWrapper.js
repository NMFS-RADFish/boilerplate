import React, { createContext } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const tableData = [
  {
    documentTitle: "Declaration of Independence",
    year: "1776",
  },
  {
    documentTitle: "Bill of Rights",
    year: "1791",
  },
  {
    documentTitle: "Declaration of Sentiments",
    year: "1848",
  },
  {
    documentTitle: "Emancipation Proclamation",
    year: "1863",
  },
];

const columnHelper = createColumnHelper();
const TableContext = createContext();

export const TableWrapper = ({ children }) => {
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
    data: tableData,
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
