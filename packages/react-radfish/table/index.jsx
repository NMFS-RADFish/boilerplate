import React, { useState, useEffect } from "react";
import "./style.css";
import { flexRender } from "@tanstack/react-table";
import { Table as TwTable, TextInput, Select, Button, Icon } from "@trussworks/react-uswds";

const TableStructureSortDirectionIcon = ({ columnKey, sortState }) => {
  const sortInfo = sortState.find((sort) => sort.key === columnKey);

  if (!sortInfo) {
    return <Icon.UnfoldMore aria-label="Unsorted" />;
  }

  return sortInfo.direction === "asc" ? (
    <Icon.ArrowUpward aria-label="Sorted ascending" />
  ) : (
    <Icon.ArrowDownward aria-label="Sorted descending" />
  );
};

const TableStructure = ({ data, columns, handleSort, sortState, onRowClick }) => {
  return (
    <>
      <RADFishTableHeader>
        <RADFishTableHeaderRow>
          {columns
            .filter((column) => !column.hidden)
            .map((column) => {
              if (column.sortable) {
                return (
                  <th
                    key={column.key}
                    onClick={() => column.sortable && handleSort(column.key)}
                    className={`${column.sortable ? "sortable-column" : ""} ${
                      column.className || ""
                    }`}
                  >
                    <div className="radfish-table-header-cell">
                      {column.label}
                      {column.sortable && (
                        <TableStructureSortDirectionIcon
                          columnKey={column.key}
                          sortState={sortState}
                        />
                      )}
                    </div>
                  </th>
                );
              }
              return (
                <th key={column.key} className={`${column.className || ""}`}>
                  {column.label}
                </th>
              );
            })}
        </RADFishTableHeaderRow>
      </RADFishTableHeader>
      <RADFishTableBody>
        {data.map((row, rowIndex) => (
          <RADFishTableBodyRow
            key={rowIndex}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          >
            {columns
              .filter((column) => !column.hidden)
              .map((column) => (
                <RADFishTableBodyCell key={column.key}>
                  {column.render && typeof column.render === "function"
                    ? column.render(row)
                    : row[column.key]}
                </RADFishTableBodyCell>
              ))}
          </RADFishTableBodyRow>
        ))}
      </RADFishTableBody>
    </>
  );
};

/**
 * A table component for displaying data with optional sorting and pagination.
 *
 * @param {Object} props - The props object.
 * @param {Array<Object>} props.data - The data to display in the table.
 * @param {Array<Object>} props.columns - The columns configuration.
 * @param {string} columns[].key - The key value to reference in your data object.
 * @param {string} columns[].label - Display name for the column.
 * @param {boolean} columns[].sortable - Flag to determine if the column is sortable.
 * @param {function(Object): JSX.Element} columns[].render - A function to render the column data for each row.
 * @param {number} props.paginationOptions.pageSize - Number of rows per page.
 * @param {number} props.paginationOptions.currentPage - Current page number.
 * @param {number} props.paginationOptions.totalRows - Total number of rows in the dataset.
 * @param {Function} props.paginationOptions.onPageChange - Function to call when the page changes.
 * @returns {JSX.Element} The rendered table component.
 */

const RADFishTable = ({
  data,
  columns,
  paginationOptions,
  onRowClick,
  defaultSort,
  className,
  ...props
}) => {
  const [sortState, setSortState] = useState(defaultSort || []);
  const [pageIndex, setPageIndex] = useState(
    paginationOptions?.currentPage ? paginationOptions.currentPage - 1 : 0,
  );

  const handleSort = (key) => {
    const existingSort = sortState.find((sort) => sort.key === key);
    let newSortState;

    if (existingSort) {
      if (existingSort.direction === "asc") {
        newSortState = sortState.map((sort) =>
          sort.key === key ? { ...sort, direction: "desc" } : sort,
        );
      } else {
        newSortState = sortState.filter((sort) => sort.key !== key);
      }
    } else {
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

  const totalRows = paginationOptions?.totalRows || data.length;

  const totalPages =
    totalRows > 0 && paginationOptions?.pageSize > 0
      ? Math.ceil(totalRows / paginationOptions.pageSize)
      : 1;

  const handlePageChange = (newPageIndex) => {
    const onPageChange = paginationOptions?.onPageChange;
    if (newPageIndex !== pageIndex) {
      setPageIndex(newPageIndex);
      if (onPageChange) {
        onPageChange(newPageIndex + 1);
      }
    }
  };

  const paginatedData = paginationOptions
    ? sortedData.slice(
        pageIndex * paginationOptions.pageSize,
        (pageIndex + 1) * paginationOptions.pageSize,
      )
    : sortedData;

  useEffect(() => {
    if (totalRows === 0) {
      setPageIndex(0);
      if (paginationOptions?.onPageChange) {
        paginationOptions.onPageChange(1);
      }
    } else if (paginationOptions?.currentPage && paginationOptions?.pageSize) {
      const maxPage = Math.ceil(totalRows / paginationOptions.pageSize);
      const newPageIndex = Math.min(Math.max(paginationOptions.currentPage - 1, 0), maxPage - 1);
      setPageIndex(newPageIndex);
    }
  }, [paginationOptions?.currentPage, paginationOptions?.pageSize, totalRows]);

  return (
    <>
      <TwTable {...props} className={`radfish-table ${className || ""}`}>
        {paginatedData && columns ? (
          <TableStructure
            data={paginatedData}
            columns={columns}
            handleSort={handleSort}
            sortState={sortState}
            onRowClick={onRowClick}
          />
        ) : (
          props.children
        )}
      </TwTable>

      {paginationOptions && (
        <div className="radfish-pagination-controls">
          <Button
            onClick={() => handlePageChange(0)}
            disabled={pageIndex === 0}
            data-testid="first-page"
          >
            <Icon.FirstPage aria-label="Go to first page" />
          </Button>
          <Button
            onClick={() => handlePageChange(pageIndex - 1)}
            disabled={pageIndex === 0}
            data-testid="previous-page"
          >
            <Icon.ArrowBack aria-label="Go to previous page" />
          </Button>
          <span>
            Page {pageIndex + 1} of {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(pageIndex + 1)}
            disabled={pageIndex >= totalPages - 1}
            data-testid="next-page"
          >
            <Icon.ArrowForward aria-label="Go to next page" />
          </Button>
          <Button
            onClick={() => handlePageChange(totalPages - 1)}
            disabled={pageIndex >= totalPages - 1}
            data-testid="last-page"
          >
            <Icon.LastPage aria-label="Go to last page" />
          </Button>
        </div>
      )}
    </>
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
      <div className="radfish-table-header-cell">
        {flexRender(props.header.column.columnDef.header)}
      </div>
    </th>
  );
};

// BODY

const RADFishTableBody = (props) => {
  return <tbody>{props.children}</tbody>;
};

const RADFishTableBodyRow = (props) => {
  return (
    <tr
      {...props}
      className={`${props.onClick ? "radfish-table-row--clickable" : ""} ${props.className || ""}`}
      onClick={props.onClick}
    >
      {props.children}
    </tr>
  );
};

const RADFishTableBodyCell = (props) => {
  return <td {...props}>{props.children}</td>;
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
      <Button
        onClick={() => setPageIndex(0)}
        disabled={!getCanPreviousPage()}
        data-testid="first-page"
      >
        <Icon.FirstPage />
      </Button>
      <Button
        onClick={() => previousPage()}
        disabled={!getCanPreviousPage()}
        data-testid="previous-page"
      >
        <Icon.ArrowBack />
      </Button>
      <Button onClick={() => nextPage()} disabled={!getCanNextPage()} data-testid="next-page">
        <Icon.ArrowForward />
      </Button>
      <Button
        onClick={() => setPageIndex(pageCount)}
        disabled={!getCanNextPage()}
        data-testid="last-page"
      >
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
