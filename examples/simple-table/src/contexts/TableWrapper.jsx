/**
 * Manages state for any child Radfish table.
 * This context should wrap the RadfishTable component and will manage it's state related to column headers, data cells, and sorting/filtering
 * This context provider is meant to be extensible and modular. You can use this anywhere in your app by wrapping a table to manage that table's state
 */

import React, { createContext } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

/**
 * Creates a column helper instance.
 * @type {import("@tanstack/react-table").ColumnHelper}
 */
const columnHelper = createColumnHelper();

/**
 * Context for the table component.
 * @type {React.Context<object>}
 */
const TableContext = createContext();

/**
 * Wrapper component for a table.
 * @param {children} - The child component that needs it's state managed, this should be the RadfishTable component.
 */
export const TableWrapper = ({ children }) => {
  const [data, setData] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);
  const [showOfflineSubmit, setShowOfflineSubmit] = React.useState(false);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  /**
   * Defines the columns for the table. This needs to be memoized for performance reasons.
   * Column helper accessors should reference the keys of each object within the data of the form.
   * This will allow the form to understand which column headers to create.
   * For instance:
   * const data = [
      {
        species: "Grouper",
        count: 10,
      },
   */
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

  /**
   * React Table instance. Initializes the table with the data being managed in TableWrapper state
   * Columns are set to the memoized value returned from the useMemo hook above
   * state and helper methods are to provide helper methods to render data, and re-render based on sorting functionality
   */
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

  /**
   * headerNames and rowModel are the result of two helper methods that make rendering table data simpler.
   *
   */
  const headerNames = table.getFlatHeaders();
  const rowModel = table.getRowModel();

  /**
   * Context value for the table.
   * @type {object}
   * @property {string} tableCaption - Caption for the table.
   * @property {TableInstance} table - The React Table instance. Returned value from useReactTable hook.
   * @property {Function} setData - Function to set table data. This can be initialized from cached data or API call.
   */
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

/**
 * Hook to access the table state within the TableWrapper context.
 * @returns {object} - The context containing table state.
 * @throws {Error} - Throws error if used outside TableWrapper context.
 */
export const useTableState = () => {
  const context = React.useContext(TableContext);
  if (!context) {
    throw new Error("useTableState must be used within a TableWrapper context");
  }
  return context;
};
