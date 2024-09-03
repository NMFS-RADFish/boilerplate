import React, { useState } from "react";
import "./style.css";
import { flexRender } from "@tanstack/react-table";
import { Table as TwTable, TextInput, Select, Button, Icon } from "@trussworks/react-uswds";

const TableStructure = ({ data, columns }) => {
  const [sortState, setSortState] = useState([]);
  const handleSort = (key) => {
    const existingSort = sortState.find((sort) => sort.key === key);
    let newSortState;

    if (existingSort) {
      if (existingSort.direction === "asc") {
        // Toggle to descending
        newSortState = sortState.map((sort) =>
          sort.key === key ? { ...sort, direction: "desc" } : sort,
        );
      } else {
        // Remove sort criteria if already descending
        newSortState = sortState.filter((sort) => sort.key !== key);
      }
    } else {
      // Add new sort criteria at the beginning of the array
      newSortState = [{ key, direction: "asc" }, ...sortState];
    }

    setSortState(newSortState);
  };

  const sortedData = [...data].sort((a, b) => {
    for (let { key, direction } of sortState) {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  return (
    <>
      <thead>
        <tr>
          {columns
            .filter((column) => !column.hidden)
            .map((column) => (
              <th key={column.key} onClick={() => column.sortable && handleSort(column.key)}>
                {column.label}
              </th>
            ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns
              .filter((column) => !column.hidden)
              .map((column) => (
                <td key={column.key}>{row[column.key]}</td>
              ))}
          </tr>
        ))}
      </tbody>
    </>
  );
};

/**
 * A table component for displaying data with optional sorting and pagination.
 *
 * @param {Object} props - The props object.
 * @param {Array<Object>} props.data - The data to display in the table.
 * @param {Array<Object>} props.columns - The columns configuration.
 * @param {number} props.paginationOptions.pageSize - Number of rows per page.
 * @param {number} props.paginationOptions.currentPage - Current page number.
 * @param {number} props.paginationOptions.totalRows - Total number of rows in the dataset.
 * @param {Function} props.paginationOptions.onPageChange - Function to call when the page changes.
 * @returns {JSX.Element} The rendered table component.
 */
const RADFishTable = ({ data, columns, ...props }) => {
  return (
    <TwTable {...props}>
      {data && columns ? <TableStructure data={data} columns={columns} /> : props.children}
    </TwTable>
  );
};

// HEADERS

const RADFishTableHeader = (props) => {
  return <thead>{props.children}</thead>;
};

const RADFishTableHeaderRow = (props) => {
  return <tr>{props.children}</tr>;
};

const RADFishTableHeaderCell = (props) => {
  const isSortable = props.header.column.getCanSort();
  const handleSort = props.header.column.getToggleSortingHandler();
  if (isSortable) {
    return (
      <th colSpan={props.header.colSpan}>
        <div className="radfish-table-header-cell" onClick={handleSort}>
          {flexRender(props.header.column.columnDef.header, props.header.getContext())}
          <RADFishSortDirectionIcon header={props.header} />
        </div>
      </th>
    );
  }
  return (
    <th colSpan={props.header.colSpan}>
      <div>{flexRender(props.header.column.columnDef.header)}</div>
    </th>
  );
};

// BODY

const RADFishTableBody = (props) => {
  return <tbody>{props.children}</tbody>;
};

const RADFishTableBodyRow = (props) => {
  return (
    <tr {...props} className={`radfish-table-row ${props.className || ""}`} onClick={props.onClick}>
      {props.children}
    </tr>
  );
};

const RADFishTableBodyCell = (props) => {
  return (
    <td {...props} style={{ background: "transparent" }}>
      {props.children}
    </td>
  );
};

const RADFishSortDirectionIcon = ({ header }) => {
  const isSorted = header.column.getIsSorted();
  switch (isSorted) {
    case "asc":
      return <Icon.ArrowUpward />;
    case "desc":
      return <Icon.ArrowDownward />;
    default:
      return <Icon.UnfoldMore />;
  }
};

// Pagination

const RADFishTablePaginationNav = ({
  getPageCount,
  setPageIndex,
  getCanPreviousPage,
  previousPage,
  nextPage,
  getCanNextPage,
}) => {
  const pageCount = getPageCount() - 1;
  return (
    <>
      <Button onClick={() => setPageIndex(0)} disabled={!getCanPreviousPage()}>
        <Icon.FirstPage />
      </Button>
      <Button onClick={() => previousPage()} disabled={!getCanPreviousPage()}>
        <Icon.ArrowBack />
      </Button>
      <Button onClick={() => nextPage()} disabled={!getCanNextPage()}>
        <Icon.ArrowForward />
      </Button>
      <Button onClick={() => setPageIndex(pageCount)} disabled={!getCanNextPage()}>
        <Icon.LastPage />
      </Button>
    </>
  );
};

const RADFishTablePaginationPageCount = ({ pageIndex, getPageCount }) => {
  return (
    <>
      Page{" "}
      <strong className="margin-x-1">
        {pageIndex} of {getPageCount()}
      </strong>
    </>
  );
};

const RADFishTablePaginationGoToPage = ({ pageIndex, setPageIndex, getPageCount }) => {
  const pageCount = getPageCount();
  return (
    <>
      | Go to page:
      <TextInput
        id="radfish-table-pagination-goto"
        type="number"
        min="0"
        value={pageIndex}
        onChange={(e) => {
          const page = e.target.value ? Number(e.target.value) - 1 : 0;
          if (page < pageCount) {
            setPageIndex(page);
          }
        }}
      />
    </>
  );
};

const RADFishTablePaginationSelectRowCount = ({
  setPageSize,
  pageSize,
  paginations = [10, 20, 30, 40, 50],
}) => {
  return (
    <Select
      id="radfish-table-pagination-select"
      value={pageSize}
      onChange={(e) => {
        setPageSize(Number(e.target.value));
      }}
    >
      {paginations.map((pageSize) => (
        <option key={pageSize} value={pageSize}>
          Show {pageSize}
        </option>
      ))}
    </Select>
  );
};

export {
  RADFishTable as Table,
  RADFishTableHeader as TableHeader,
  RADFishTableHeaderRow as TableHeaderRow,
  RADFishTableHeaderCell as TableHeaderCell,
  RADFishTableBody as TableBody,
  RADFishTableBodyRow as TableBodyRow,
  RADFishTableBodyCell as TableBodyCell,
  RADFishTablePaginationNav as TablePaginationNav,
  RADFishTablePaginationPageCount as TablePaginationPageCount,
  RADFishTablePaginationGoToPage as TablePaginationGoToPage,
  RADFishTablePaginationSelectRowCount as TablePaginationSelectRowCount,
};
