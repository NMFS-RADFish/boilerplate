import React from "react";
import { render, act } from "@testing-library/react";
import { TableWrapper, useTableState } from "../../contexts/TableWrapper";

// Mocking react-table module
jest.mock("@tanstack/react-table", () => ({
  createColumnHelper: jest.fn(() => ({
    accessor: jest.fn(),
  })),
  getCoreRowModel: jest.fn(() => jest.fn()),
  getSortedRowModel: jest.fn(() => jest.fn()),
  useReactTable: jest.fn(() => {
    return {
      getHeaderGroups: jest.fn(() => [{ headers: [] }]),
      getRowModel: jest.fn(() => ({ rows: [] })),
      state: { sorting: [] },
      setSorting: jest.fn(),
    };
  }),
}));

describe("TableWrapper", () => {
  it("renders children and passes context values correctly", async () => {
    const TestComponent = () => {
      const { tableCaption, table, headerGroup, rowModel, setData } = useTableState();
      return (
        <div>
          <span>{tableCaption}</span>
          <span>
            {table && headerGroup && rowModel
              ? "Context values exist"
              : "Context values do not exist"}
          </span>
          <button onClick={() => setData([{ species: "Test", count: 1 }])}>Set Data</button>
        </div>
      );
    };

    const { getByText } = render(
      <TableWrapper>
        <TestComponent />
      </TableWrapper>,
    );

    // Ensure table caption is rendered
    expect(
      getByText("This table shows how many of each fish species were caught"),
    ).toBeInTheDocument();

    // Ensure context values exist after rendering
    expect(getByText("Context values exist")).toBeInTheDocument();

    // Click the button to set data and check if setData function works
    await act(async () => {
      getByText("Set Data").click();
    });
    expect(useTableState().table).toHaveLength(1); // Assuming the table state changes upon setting data
  });
});
