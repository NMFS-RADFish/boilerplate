/**
 * Component for displaying a demo table.
 * @returns {React.ReactNode} - The demo table component.
 */

import { useEffect } from "react";
import { useTableState } from "../contexts/TableWrapper.example";
import {
  Table,
  TableBody,
  TableBodyRow,
  TableHeaderCell,
  TableHeader,
  TableHeaderRow,
  TableBodyCell,
  Button,
} from "../packages/react-components";
import { useNavigate } from "react-router-dom";
import useOfflineStorage from "../hooks/useOfflineStorage.example";

const TripReportTableClamLobster = () => {
  const { tableCaption, table, headerNames, rowModel, setData, setShowOfflineSubmit } =
    useTableState();
  const navigate = useNavigate();
  const { findOfflineData } = useOfflineStorage();

  useEffect(() => {
    const getTableData = async () => {
      const offlineTripReportClamLobsterData = await findOfflineData(
        "offlineTripReportClamLobsterData",
      );
      setData(offlineTripReportClamLobsterData);
    };

    getTableData();
  }, [setData, setShowOfflineSubmit]);

  const handleRowClick = (row) => {
    console.log(row);
    navigate(`/tripReport/${row.id}`);
  };

  if (!table) {
    return null;
  }

  return (
    <>
      <div className="margin-left-auto display-flex flex-column flex-align-end width-auto">
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
              const isOfflineData = row.original.isOffline && !row.original.isSubmitted;
              return (
                <TableBodyRow
                  row={row}
                  onClick={() => handleRowClick(row)}
                  className={isOfflineData && "bg-gray-10"}
                  key={row.original.id}
                  data-testid="table-body-row"
                >
                  {row.getVisibleCells().map((cell) => {
                    const isStatusColumn = cell.column.id === "isOffline";
                    return (
                      <TableBodyCell className="radfish-table-body-cell" key={cell.id} cell={cell}>
                        {isStatusColumn && isOfflineData && (
                          <Button
                            onClick={(e) => handleSubmitDraft(e, [row.original])}
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
      </div>
    </>
  );
};

export { TripReportTableClamLobster };
