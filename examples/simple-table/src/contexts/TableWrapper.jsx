import React, { createContext } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";


const columnHelper = createColumnHelper();
const TableContext = createContext();

export const TableWrapper = ({ children }) => {
  const [data, setData] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);
  const [showOfflineSubmit, setShowOfflineSubmit] = React.useState(false);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("isDraft", {
        cell: (info) => (info.getValue() ? "Draft " : "Submitted"),
        header: () => <span>Status</span>,
      }),
      columnHelper.accessor("uuid", {
        cell: (info) => info.getValue(),
        header: () => <span>Id</span>,
      }),
      columnHelper.accessor("species", {
        cell: (info) => info.getValue(),
        header: () => <span>Species</span>,
      }),
      columnHelper.accessor("numberOfFish", {
        cell: (info) => info.getValue(),
        header: () => <span>Amount Caught</span>,
      }),
      columnHelper.accessor("computedPrice", {
        cell: (info) => info.getValue(),
        header: () => <span>Price</span>,
      }),
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
  });

  const headerNames = table.getFlatHeaders();
  const rowModel = table.getRowModel();

  const contextValue = {
    tableCaption: "This table shows how many of each fish species were caught",
    table,
    headerNames,
    rowModel,
    setData,
    showOfflineSubmit,
    setShowOfflineSubmit,
  };

  return <TableContext.Provider value={contextValue}>{children}</TableContext.Provider>;
};

export const useTableState = () => {
  const context = React.useContext(TableContext);
  if (!context) {
    throw new Error("useTableState must be used within a TableWrapper context");
  }
  return context;
};
