/**
 * Component for displaying a demo table.
 * @returns {React.ReactNode} - The demo table component.
 */

import { useState, useEffect } from "react";
import { flexRender } from "@tanstack/react-table";
import { useTableState } from "../contexts/TableWrapper.example";
import {
  Table,
  TableBody,
  TableBodyRow,
  TableHeaderCell,
  TableHeader,
  TableHeaderRow,
  TableBodyCell,
} from "../packages/react-components";
import { useNavigate } from "react-router-dom";
import useOfflineStorage from "../hooks/useOfflineStorage.example";
import { generateUUID } from "../utilities";

const TripReportTableClamLobster = () => {
  const { tableCaption, table, headerNames, rowModel, setData, setShowOfflineSubmit } =
    useTableState();
  const navigate = useNavigate();
  const { findOfflineData } = useOfflineStorage();
  const [tripTypes, setTripTypes] = useState();

  useEffect(() => {
    const getTableData = async () => {
      const offlineTripReportClamLobsterData = await findOfflineData(
        "offlineTripReportClamLobsterData",
      );
      const tripTypesData = await findOfflineData("tripTypesData");
      setData(offlineTripReportClamLobsterData);
      setTripTypes(tripTypesData);
    };

    getTableData();
  }, [setData, setShowOfflineSubmit]);

  const handleRowClick = (row) => {
    const uuid = generateUUID();
    navigate(`/tripReport/${row.id}/${uuid}`);
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
              return (
                <TableBodyRow
                  row={row}
                  onClick={() => handleRowClick(row)}
                  key={row.id}
                  data-testid="table-body-row"
                >
                  {row.getVisibleCells().map((cell) => {
                    if (cell.column.id === "TRIP_TYPE") {
                      const cellTripType = tripTypes.find((trip) => trip.KEY === cell.getValue());
                      return (
                        <TableBodyCell
                          className="radfish-table-body-cell"
                          key={cell.id}
                          cell={cell}
                        >
                          {cellTripType.VALUE}
                        </TableBodyCell>
                      );
                    }
                    return (
                      <TableBodyCell className="radfish-table-body-cell" key={cell.id} cell={cell}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
