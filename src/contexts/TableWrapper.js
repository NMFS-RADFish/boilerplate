import React, { createContext } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
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

const columns = [
  columnHelper.accessor("documentTitle", {
    cell: (info) => info.getValue(),
    header: () => <span>Document Title</span>,
  }),
  columnHelper.accessor("year", {
    cell: (info) => info.getValue(),
    header: () => <span>Year Created</span>,
  }),
];

const TableContext = createContext();

export const TableWrapper = ({ children }) => {
  const table = useReactTable({ data: tableData, columns, getCoreRowModel: getCoreRowModel() });
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
