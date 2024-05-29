# Simple Table Example

This is an example on how to create a table to display data using the `TableWrapper` context provider. `TableWrapper` is built using [React Table](https://react-table-v7-docs.netlify.app/docs/overview).

## Steps

1. `npm install @tanstack/react-table`
2. Import the `TableWrapper` context provider into a parent component, in this example the parent component is `index.jsx`. The context provider takes two props:
   1. `pageSize` : how many rows to display per page, the default value is 10.
   2. `columnMap` : this creates the column names and maps the column cells to the column header.
3. Configure the column mapping in the parent component, in this example the parent component is `index.jsx`.

   1. Import `createColumnHelper` and create the `columnHelper` array:

   ````jsx
    import { createColumnHelper } from "@tanstack/react-table";

    const columnHelper = createColumnHelper();

    const columnMap = [
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
   ];```

   ````

4. Wrap the parent component with the `Table Wrapper` context provider and pass in the necessary props:
   ```jsx
   <TableWrapper columnMap={columnMap} pageSize={10}>
     <App />
   </TableWrapper>
   ```
5. The `TableWrapper` context provider provides a `useTableState` hook that can be used to interact with the table. The following utilities are available:
   ```jsx
   const contextValue = {
     table, // can be used to get full access to table
     headerNames, // get header/column names
     rowModel, // get row info
     setData, // set the table data
     showOfflineSubmit, // display offline submit button
     setShowOfflineSubmit, // set whether or not to display button
   };
   ```
6. See `App.jsx` for full example of how to construct the table using the `react-radfish` components and use the `useTableState` hook.
