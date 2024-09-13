import { render, screen, fireEvent } from "@testing-library/react";
import { Table } from "./index";

describe("Table", () => {
  it("calls onPageChange when pagination is used", () => {
    const data = [
      { Name: "Alice", Age: 32 },
      { Name: "Bob", Age: 28 },
      { Name: "Charlie", Age: 22 },
    ];

    const columns = [
      { key: "Name", label: "Name", sortable: true },
      { key: "Age", label: "Age", sortable: true },
    ];

    const onPageChangeMock = vi.fn();

    render(
      <Table
        data={data}
        columns={columns}
        paginationOptions={{
          pageSize: 2,
          currentPage: 1,
          onPageChange: onPageChangeMock,
          totalRows: data.length,
        }}
      />,
    );

    screen.debug();

    fireEvent.click(screen.getByTestId("next-page")); // Click the "Next" button using data-testid

    expect(onPageChangeMock).toHaveBeenCalledWith(2); // Should have been called with the next page number
  });
});
