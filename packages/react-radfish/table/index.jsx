import React, { useState, useEffect } from "react";
import "./style.css";
import { flexRender } from "@tanstack/react-table";
import { Table as TwTable, TextInput, Select, Button, Icon } from "@trussworks/react-uswds";

const TableStructure = ({ data, columns }) => {
  return (
    <>
      <thead>
        <tr>
          {columns
            .filter((column) => !column.hidden)
            .map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
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

const RADFishTable = ({
  data,
  columns,
  paginationOptions: { pageSize, currentPage, totalRows, onPageChange },
  ...props
}) => {
  const [pageIndex, setPageIndex] = useState(currentPage - 1);

  const totalPages = totalRows > 0 && pageSize > 0 ? Math.ceil(totalRows / pageSize) : 1;

  const handlePageChange = (newPageIndex) => {
    console.log("handlePageChange called with index:", newPageIndex);

    if (newPageIndex !== pageIndex) {
      setPageIndex(newPageIndex);
      onPageChange(newPageIndex + 1);
    }
  };

  const paginatedData = data.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  useEffect(() => {
    setPageIndex(currentPage - 1);
  }, [currentPage]);

  return (
    <>
      <TwTable {...props}>
        {paginatedData && columns ? (
          <TableStructure data={paginatedData} columns={columns} />
        ) : (
          props.children
        )}
      </TwTable>

      <div className="pagination-controls">
        <Button
          onClick={() => handlePageChange(0)}
          disabled={pageIndex === 0}
          data-testid="first-page"
        >
          <Icon.FirstPage />
        </Button>
        <Button
          onClick={() => handlePageChange(pageIndex - 1)}
          disabled={pageIndex === 0}
          data-testid="previous-page"
        >
          <Icon.ArrowBack />
        </Button>
        <span>
          Page {pageIndex + 1} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(pageIndex + 1)}
          disabled={pageIndex >= totalPages - 1}
          data-testid="next-page"
        >
          <Icon.ArrowForward />
        </Button>
        <Button
          onClick={() => handlePageChange(totalPages - 1)}
          disabled={pageIndex >= totalPages - 1}
          data-testid="last-page"
        >
          <Icon.LastPage />
        </Button>
      </div>
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
