import "./style.css";
import { flexRender } from "@tanstack/react-table";
import { Table as TwTable } from "@trussworks/react-uswds";
import { Icon } from "@trussworks/react-uswds";
import { TextInput, Select } from "../inputs";
import { Button } from "../buttons";

const RadfishTable = (props) => {
  return <TwTable {...props}>{props.children}</TwTable>;
};

// HEADERS

const RadfishTableHeader = (props) => {
  return <thead>{props.children}</thead>;
};

const RadfishTableHeaderRow = (props) => {
  return <tr>{props.children}</tr>;
};

const RadfishTableHeaderCell = (props) => {
  const isSortable = props.header.column.getCanSort();
  const handleSort = props.header.column.getToggleSortingHandler();
  if (isSortable) {
    return (
      <th colSpan={props.header.colSpan}>
        <div
          className="cursor-pointer select-none"
          onClick={handleSort}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {flexRender(props.header.column.columnDef.header, props.header.getContext())}
          <RadfishSortDirectionIcon header={props.header} />
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

const RadfishTableBody = (props) => {
  return <tbody>{props.children}</tbody>;
};

const RadfishTableBodyRow = (props) => {
  return (
    <tr className="radfish-table-row" style={props.style} onClick={props.onClick}>
      {props.children}
    </tr>
  );
};

const RadfishTableBodyCell = (props) => {
  return (
    <td {...props}>{flexRender(props.cell.column.columnDef.cell, props.cell.getContext())}</td>
  );
};

const RadfishSortDirectionIcon = ({ header }) => {
  const isSorted = header.column.getIsSorted();
  switch (isSorted) {
    case "asc":
      return <Icon.ArrowUpward />;
    case "desc":
      return <Icon.ArrowDownward />;
    default:
      return null;
  }
};

// Pagination

const RadfishTablePaginationNav = ({
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

const RadfishTablePaginationPageCount = ({ pageIndex, getPageCount }) => {
  return (
    <>
      Page{" "}
      <strong className="margin-x-2px">
        {pageIndex} of {getPageCount()}
      </strong>
    </>
  );
};

const RadfishTablePaginationGoToPage = ({ pageIndex, setPageIndex }) => {
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
          setPageIndex(page);
        }}
      />
    </>
  );
};

const RadfishTablePaginationSelectRowCount = ({ setPageSize, pageSize }) => {
  return (
    <Select
      id="radfish-table-pagination-select"
      value={pageSize}
      onChange={(e) => {
        setPageSize(Number(e.target.value));
      }}
    >
      {[10, 20, 30, 40, 50].map((pageSize) => (
        <option key={pageSize} value={pageSize}>
          Show {pageSize}
        </option>
      ))}
    </Select>
  );
};

export {
  RadfishTable as Table,
  RadfishTableHeader as TableHeader,
  RadfishTableHeaderRow as TableHeaderRow,
  RadfishTableHeaderCell as TableHeaderCell,
  RadfishTableBody as TableBody,
  RadfishTableBodyRow as TableBodyRow,
  RadfishTableBodyCell as TableBodyCell,
  RadfishTablePaginationNav as TablePaginationNav,
  RadfishTablePaginationPageCount as TablePaginationPageCount,
  RadfishTablePaginationGoToPage as TablePaginationGoToPage,
  RadfishTablePaginationSelectRowCount as TablePaginationSelectRowCount,
};
