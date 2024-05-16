import "./index.css";
import React, { useState, useEffect } from "react";
import { Alert } from "@trussworks/react-uswds";
import {
  Table,
  TableBody,
  TableBodyRow,
  TableHeaderCell,
  TableHeader,
  TableHeaderRow,
  TableBodyCell,
  Button,
  TablePaginationNav,
  TablePaginationPageCount,
  TablePaginationGoToPage,
  TablePaginationSelectRowCount,
} from "radfish-react";
import { useTableState } from "./contexts/TableWrapper";
import { useOfflineStorage } from "./packages/contexts/OfflineStorageWrapper";

function App() {
  const { tableCaption, table, headerNames, rowModel, setData } = useTableState();
  const { findOfflineData } = useOfflineStorage();

  useEffect(() => {
    const fetchTableData = async () => {
      const data = await findOfflineData("formData");
      setData(data);
    };
    fetchTableData();
  }, []);

  return (
    <div className="grid-container">
      <InfoAnnotation />
      <Table bordered caption={tableCaption || ""} fullWidth fixed>
        <TableHeader table={table}>
          <TableHeaderRow table={table}>
            {headerNames.map((header) => {
              return <TableHeaderCell key={header.id} header={header} />;
            })}
          </TableHeaderRow>
        </TableHeader>
        <TableBody table={table}>
          {rowModel.rows.map((row) => {
            const isOfflineData = row.original.isDraft;
            return (
              <TableBodyRow
                row={row}
                className={isOfflineData && "bg-gray-10"}
                key={row.original.uuid}
                data-testid="table-body-row"
              >
                {row.getVisibleCells().map((cell) => {
                  const isStatusColumn = cell.column.id === "isDraft";
                  return (
                    <TableBodyCell className="radfish-table-body-cell" key={cell.id} cell={cell}>
                      {isStatusColumn && isOfflineData && (
                        <Button
                          onClick={() => console.log("send to server")}
                          className="font-ui-3xs padding-3px margin-left-205"
                        >
                          Submit
                        </Button>
                      )}
                    </TableBodyCell>
                  );
                })}
              </TableBodyRow>
            );
          })}
        </TableBody>
      </Table>
      <Alert type="info" slim={true}>
        Below are examples of the different pagination components available. Each component is
        optional and can be used as needed. Components can be found in the `radfish-react`
        directory.
      </Alert>
      <div className="grid-container margin-bottom-3">
        <div className="grid-row display-flex tablet:flex-justify flex-align-center mobile-lg:display-flex flex-justify-center">
          <div className="width-mobile grid-col-auto display-flex flex-no-wrap">
            <TablePaginationNav
              setPageIndex={table.setPageIndex}
              previousPage={table.previousPage}
              nextPage={table.nextPage}
              getCanPreviousPage={table.getCanPreviousPage}
              getCanNextPage={table.getCanNextPage}
              getPageCount={table.getPageCount}
            />
          </div>
          <div className="grid-col-auto display-flex flex-wrap flex-align-center margin-y-1">
            <TablePaginationPageCount
              pageIndex={table.getState().pagination.pageIndex + 1}
              getPageCount={table.getPageCount}
            />
            <TablePaginationGoToPage
              pageIndex={table.getState().pagination.pageIndex + 1}
              setPageIndex={table.setPageIndex}
              getPageCount={table.getPageCount}
            />
            <TablePaginationSelectRowCount
              pageSize={table.getState().pagination.pageSize}
              setPageSize={table.setPageSize}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoAnnotation() {
  return (
    <Alert type="info" headingLevel={"h1"} heading="Table Components">
      Below is an example of a table that's populated by server and locally stored data
      (localStorage or indexedDB). The table is designed to be used with the `TableWrapper`
      component, it's built with{" "}
      <a
        href="https://tanstack.com/table/latest/docs/introduction"
        target="_blank"
        rel="noopener noreferrer"
      >
        react-table
      </a>
      .
      <br />
      <br />
      Offline form data entries or "drafts" are highlighted in grey, and can be submitted to the
      server using the "submit" button in the "status" column when the application is connected to
      the internet.
      <br />
      <br />
      <strong>Note:</strong> Annotations are for informational purposes only. In production, you
      would remove the annotations. Components with annotations above them are optional. You can
      choose whether or not to use them in your application.
      <br />
      <br />
      <a
        href="https://nmfs-radfish.github.io/documentation/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button type="button">Go To Documentation</Button>
      </a>
      <a
        href="https://tanstack.com/table/latest/docs/introduction"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button type="button">React Table</Button>
      </a>
    </Alert>
  );
}

export default App;
