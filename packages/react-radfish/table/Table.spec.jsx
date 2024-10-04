import "@testing-library/jest-dom";
import { render, screen, fireEvent, within } from "@testing-library/react";
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

    render(<Table data={data} columns={columns} />);

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
      <Table
        data={data}
        columns={columns}
        paginationOptions={{
          pageSize: 2,
          currentPage: 1,
          totalRows: data.length,
        }}
      />,
    );

    fireEvent.click(screen.getByTestId("next-page")); // Click the "Next" button using data-testid
  });
});
