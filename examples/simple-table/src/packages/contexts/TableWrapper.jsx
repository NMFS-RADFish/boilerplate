import React, { createContext } from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

const TableContext = createContext();

export const TableWrapper = ({ children, columnMap, pageSize }) => {
  const [data, setData] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);
  const [showOfflineSubmit, setShowOfflineSubmit] = React.useState(false);
  const defaultPageSize = 10;
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: pageSize || defaultPageSize,
  });

  const columns = React.useMemo(() => columnMap, []);

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
