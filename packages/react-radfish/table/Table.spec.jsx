import "@testing-library/jest-dom";
import { ErrorBoundary } from "../ErrorBoundary";
import { render, screen, fireEvent, within, act } from "@testing-library/react";
import { Table } from "./index";

describe("Table", () => {
  it("renders table with data", () => {
    const data = [
      { Name: "Alice", Age: 32 },
      { Name: "Bob", Age: 28 },
    ];

    const columns = [
      { key: "Name", label: "Name", sortable: true },
      { key: "Age", label: "Age", sortable: true },
    ];

    const onPageChangeMock = vi.fn();

    const paginationOptions = {
      pageSize: 2,
      currentPage: 1,
      onPageChange: onPageChangeMock,
      totalRows: data.length,
    };

    render(<Table data={data} columns={columns} paginationOptions={paginationOptions} />);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("hides column when hidden is true", () => {
    const data = [
      { Name: "Alice", Age: 32 },
      { Name: "Bob", Age: 28 },
    ];

    const columns = [
      { key: "Name", label: "Name", sortable: true },
      { key: "Age", label: "Age", sortable: true, hidden: true },
    ];

    const onPageChangeMock = vi.fn();

    const paginationOptions = {
      pageSize: 2,
      currentPage: 1,
      onPageChange: onPageChangeMock,
      totalRows: data.length,
    };

    render(<Table data={data} columns={columns} paginationOptions={paginationOptions} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.queryByText("Age")).not.toBeInTheDocument(); // Age column should not be rendered
  });

  it("renders rows in correct order after sorting by multiple criteria", () => {
    const data = [
      { Name: "Alice", Age: 32 },
      { Name: "Bob", Age: 28 },
      { Name: "Charlie", Age: 32 },
      { Name: "Alice", Age: 28 },
    ];

    const columns = [
      { key: "Name", label: "Name", sortable: true },
      { key: "Age", label: "Age", sortable: true },
    ];

    const onPageChangeMock = vi.fn();

    const paginationOptions = {
      pageSize: 4,
      currentPage: 1,
      onPageChange: onPageChangeMock,
      totalRows: data.length,
    };

    render(<Table data={data} columns={columns} paginationOptions={paginationOptions} />);

    // First click on Age sorts by Age ascending
    fireEvent.click(screen.getByText("Age"));
    let rows = screen.getAllByRole("row");
    expect(within(rows[1]).getByText("Bob")).toBeInTheDocument();
    expect(within(rows[2]).getByText("Alice")).toBeInTheDocument();
    expect(within(rows[3]).getByText("Alice")).toBeInTheDocument();
    expect(within(rows[4]).getByText("Charlie")).toBeInTheDocument();

    // Second click on Name sorts by Name ascending, then by Age ascending
    fireEvent.click(screen.getByText("Name"));
    rows = screen.getAllByRole("row");
    expect(within(rows[1]).getByText("Alice")).toBeInTheDocument();
    expect(within(rows[1]).getByText("28")).toBeInTheDocument();
    expect(within(rows[2]).getByText("Alice")).toBeInTheDocument();
    expect(within(rows[2]).getByText("32")).toBeInTheDocument();
    expect(within(rows[3]).getByText("Bob")).toBeInTheDocument();
    expect(within(rows[4]).getByText("Charlie")).toBeInTheDocument();

    // Third click on Age toggles Age to descending, but keeps Name ascending
    fireEvent.click(screen.getByText("Age"));
    rows = screen.getAllByRole("row");
    expect(within(rows[1]).getByText("Alice")).toBeInTheDocument();
    expect(within(rows[1]).getByText("32")).toBeInTheDocument();
    expect(within(rows[2]).getByText("Alice")).toBeInTheDocument();
    expect(within(rows[2]).getByText("28")).toBeInTheDocument();
    expect(within(rows[3]).getByText("Bob")).toBeInTheDocument();
    expect(within(rows[4]).getByText("Charlie")).toBeInTheDocument();

    // Fourth click on Age removes Age from the sort criteria, should sort only by Name
    fireEvent.click(screen.getByText("Age"));
    rows = screen.getAllByRole("row");
    expect(within(rows[1]).getByText("Alice")).toBeInTheDocument();
    expect(within(rows[2]).getByText("Alice")).toBeInTheDocument();
    expect(within(rows[3]).getByText("Bob")).toBeInTheDocument();
    expect(within(rows[4]).getByText("Charlie")).toBeInTheDocument();
  });

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

    fireEvent.click(screen.getByTestId("next-page")); // Click the "Next" button using data-testid

    expect(onPageChangeMock).toHaveBeenCalledWith(2); // Should have been called with the next page number
  });

  it("uses default value if totalRows not provided", () => {
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
        }}
      />,
    );

    fireEvent.click(screen.getByTestId("next-page"));

    expect(onPageChangeMock).toHaveBeenCalledWith(2);
  });

  it("will not call onPageChange if not provided", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const data = [
      { Name: "Alice", Age: 32 },
      { Name: "Bob", Age: 28 },
      { Name: "Charlie", Age: 22 },
    ];

    const columns = [
      { key: "Name", label: "Name", sortable: true },
      { key: "Age", label: "Age", sortable: true },
    ];

    render(
      <ErrorBoundary>
        <Table
          data={data}
          columns={columns}
          paginationOptions={{
            pageSize: 2,
            currentPage: 1,
            totalRows: data.length,
          }}
        />
      </ErrorBoundary>,
    );

    fireEvent.click(screen.getByTestId("next-page")); // Click the "Next" button using data-testid

    // Assert that console.error was not called
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    // Restore the original console.error
    consoleErrorSpy.mockRestore();
  });

  it("applies defaultSort correctly and renders rows in the expected order", () => {
    const data = [
      { id: 1, firstName: "Alice", lastName: "Smith", age: 25 },
      { id: 2, firstName: "Bob", lastName: "Jones", age: 30 },
      { id: 3, firstName: "Charlie", lastName: "Smith", age: 20 },
      { id: 4, firstName: "Dave", lastName: "Jones", age: 40 },
      { id: 5, firstName: "Eva", lastName: "Brown", age: 35 },
    ];

    const columns = [
      { key: "firstName", label: "First Name", sortable: true },
      { key: "lastName", label: "Last Name", sortable: true },
      { key: "age", label: "Age", sortable: true },
    ];

    const defaultSort = [
      { key: "lastName", direction: "asc" },
      { key: "firstName", direction: "desc" },
    ];

    const onPageChangeMock = vi.fn();

    const paginationOptions = {
      pageSize: 5,
      currentPage: 1,
      onPageChange: onPageChangeMock,
      totalRows: data.length,
    };

    render(
      <Table
        data={data}
        columns={columns}
        defaultSort={defaultSort}
        paginationOptions={paginationOptions}
      />,
    );

    // Get all data rows (excluding the header row)
    const rows = screen.getAllByRole("row").slice(1); // Remove header row

    // Expected order based on defaultSort
    const expectedOrder = [
      { firstName: "Eva", lastName: "Brown" },
      { firstName: "Dave", lastName: "Jones" },
      { firstName: "Bob", lastName: "Jones" },
      { firstName: "Charlie", lastName: "Smith" },
      { firstName: "Alice", lastName: "Smith" },
    ];

    // Assert that the rows are in the expected order
    expectedOrder.forEach((expectedData, index) => {
      const row = rows[index];
      expect(within(row).getByText(expectedData.firstName)).toBeInTheDocument();
      expect(within(row).getByText(expectedData.lastName)).toBeInTheDocument();
    });
  });
});
