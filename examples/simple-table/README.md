# Simple Table Example

[Official Documentation](https://nmfs-radfish.github.io/documentation/)

This is an example on how to create a table to display data using the `<Table>` component. The `<Table>` component is a flexible and customizable table component designed for displaying tabular data. It supports sorting, pagination, and custom rendering of cells.

Learn more about RADFish examples at the official [documentation](https://nmfs-radfish.github.io/documentation/docs/developer-documentation/examples-and-templates#examples)

## Usage

### Basic Example

To use the `<Table>` component, import it and pass the required `data`, `columns`, and `paginationOptions`.

```jsx
import React from "react";
import { Table } from "@trussworks/react-uswds";

const columns = [
  {
    key: "id",
    label: "ID",
    sortable: true,
  },
  {
    key: "name",
    label: "Name",
    sortable: true,
  },
  {
    key: "age",
    label: "Age",
    sortable: true,
    render: (row) => <strong>{row.age}</strong>, // Custom render for the Age column
  },
];

const data = [
  { id: 1, name: "John Doe", age: 25 },
  { id: 2, name: "Jane Smith", age: 30 },
  { id: 3, name: "Alice Johnson", age: 28 },
];

const handlePageChange = (newPage) => {
  console.log(`Page changed to: ${newPage}`);
};

const paginationOptions = {
  pageSize: 2,
  currentPage: 1,
  totalRows: 3,
  onPageChange: handlePageChange,
};

const MyTableComponent = () => (
  <Table data={data} columns={columns} paginationOptions={paginationOptions} />
);

export default MyTableComponent;
```

## Props

### `data`

- **Type**: `Array<Object>`
- **Description**: The array of objects representing your table's data. Each object should have keys matching the `key` values provided in the `columns` prop.

### `columns`

- **Type**: `Array<Object>`
- **Description**: Defines the structure and configuration of the table columns.

Each object in `columns` should have the following properties:

- **`key`**: (string) The key used to access the data value for this column.
- **`label`**: (string) The display name of the column header.
- **`sortable`**: (boolean) Indicates whether this column should allow sorting.
- **`render`**: (function) _(Optional)_ A function that returns a JSX element to 
- **`className`**: (string) _(Optional)_ For custom styling.

### `paginationOptions`

- **Type**: `Object`
- **Description**: Provides options for handling pagination.

The `paginationOptions` object should include:

- **`pageSize`**: (number) Number of rows to display per page.
- **`currentPage`**: (number) The current page being displayed.
- **`totalRows`**: (number) The total number of rows in the dataset.
- **`onPageChange`**: (function) Callback function triggered when the page changes. It provides the new page index as an argument.

### `className`

- **Type**: `string`
- **Description**: An optional `className` for custom styling.

## Sorting

To enable sorting for a column, set `sortable: true` in the `columns` configuration for that column. Clicking the column header will toggle between ascending, descending, and unsorted states.

### Multi-Sort

The table supports **multi-column sorting**, allowing you to sort data by multiple columns in order of priority. This means you can first sort by one column, then apply additional sorts on other columns, and the data will be sorted based on all specified columns.

#### How to Use Multi-Sort

- **Applying Multiple Sorts**: Click on the column headers you wish to sort by, in the order of sorting priority. Each click adds or updates the sort state for that column.
  
- **Sort Order Priority**: The order in which you click the columns determines their priority in sorting. The first column clicked is the primary sort, the second is the secondary sort, and so on.
  
- **Changing Sort Direction**: Clicking on a sorted column header cycles its sort direction between ascending, descending, and unsorted (which removes it from the sort state).

## Custom Cell Rendering

You can pass a render function to any column to customize how the data is displayed in that column. The render function receives the row object as an argument.

## Pagination

The paginationOptions prop allows you to specify pagination controls for the table. The component will display a pagination control bar to navigate between pages.
