import "./style.css";
import { flexRender } from "@tanstack/react-table";
import { Table as TwTable } from "@trussworks/react-uswds";
import { Icon } from "@trussworks/react-uswds";

const RadfishTable = (props) => {
  return <TwTable {...props}>{props.children}</TwTable>;
};

// HEADERS

const RadfishTableHeader = (props) => {
  return <thead>{props.children}</thead>;
};

const RadfishTableHeaderRow = (props) => {
  const headerGroup = props.table.getHeaderGroups();
  return <tr key={headerGroup.id}>{props.children}</tr>;
};

const RadfishTableHeaderCell = (props) => {
  const isSortable = props.header.column.getCanSort();
  const handleSort = props.header.column.getToggleSortingHandler();

  if (isSortable) {
    return (
      <th key={props.header.id} colSpan={props.header.colSpan}>
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
    <th key={props.header.id} colSpan={props.header.colSpan}>
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
    <tr className="radfish-table-row" key={props.row.id} onClick={props.onClick}>
      {props.children}
    </tr>
  );
};

const RadfishTableBodyCell = (props) => {
  return (
    <td key={props.cell.id} {...props}>
      {flexRender(props.cell.column.columnDef.cell, props.cell.getContext())}
    </td>
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

export {
  RadfishTable as Table,
  RadfishTableHeader as TableHeader,
  RadfishTableHeaderRow as TableHeaderRow,
  RadfishTableHeaderCell as TableHeaderCell,
  RadfishTableBody as TableBody,
  RadfishTableBodyRow as TableBodyRow,
  RadfishTableBodyCell as TableBodyCell,
};
