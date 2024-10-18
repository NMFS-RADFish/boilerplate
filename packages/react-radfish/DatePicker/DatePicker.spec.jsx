import React, { useState, useRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DatePicker } from "./index";

describe("DatePicker Component", () => {
  test("renders DatePicker, uncontrolled input has its value reset", () => {
    render(
      <form>
        <DatePicker label="Select Date" id="date-picker" defaultValue="2024-08-01" />
        <button type="reset">Reset</button>
      </form>,
    );

    const dateInput = screen.getByLabelText("Select Date");
    const resetButton = screen.getByText("Reset");

    // Initial render test
    expect(dateInput).toHaveValue("2024-08-01");

    // Change the input value
    fireEvent.change(dateInput, { target: { value: "2024-08-02" } });
    expect(dateInput).toHaveValue("2024-08-02");

    // Trigger form reset
    fireEvent.click(resetButton);
    expect(dateInput).toHaveValue("2024-08-01");
  });

  test("renders DatePicker, controlled input has its value reset", () => {
    const FormWithControlledDatePicker = () => {
      const [date, setDate] = useState("2024-08-01");

      const handleReset = (event) => {
        event.preventDefault();
        setDate("2024-08-01");
      };

      const handleChange = (event) => {
        setDate(event.target.value);
      };

      return (
        <form onReset={handleReset}>
          <DatePicker label="Select Date" id="date-picker" value={date} onChange={handleChange} />
          <button type="reset">Reset</button>
        </form>
      );
    };

    render(<FormWithControlledDatePicker />);

    const dateInput = screen.getByLabelText("Select Date");
    const resetButton = screen.getByText("Reset");

    // Initial render test
    expect(dateInput).toHaveValue("2024-08-01");

    // Change the input value
    fireEvent.change(dateInput, { target: { value: "2024-08-02" } });
    expect(dateInput).toHaveValue("2024-08-02");

    // Trigger form reset
    fireEvent.click(resetButton);
    expect(dateInput).toHaveValue("2024-08-01");
  });

  test("renders DatePicker with custom className", () => {
    render(<DatePicker label="Custom Class" id="custom-class" className="custom-datepicker" />);
    const formGroup = screen.getByLabelText("Custom Class").closest(".usa-form-group");
    expect(formGroup).toHaveClass("custom-datepicker");
  });

  test("renders DatePicker with correct label", () => {
    render(<DatePicker label="Test Label" id="test-label" />);
    const label = screen.getByText("Test Label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("for", "test-label");
  });

  test("renders DatePicker with correct id", () => {
    render(<DatePicker label="Test ID" id="test-id" />);
    const input = screen.getByLabelText("Test ID");
    expect(input).toHaveAttribute("id", "test-id");
  });

  test("renders DatePicker as required has requiredMarker", () => {
    render(<DatePicker label="Test Required" id="test-required" required />);

    const input = screen.getByTestId("date-picker-input");
    expect(input).toBeInTheDocument();
    expect(input).toBeRequired();

    const label = screen.getByTestId("label");
    expect(label).toBeInTheDocument();

    const marker = screen.queryByText("*");
    expect(marker).toBeInTheDocument();
  });

  test("renders DatePicker as NOT required and requiredMarker not set", () => {
    render(<DatePicker label="Test Not Required" id="test-not-required" />);
    const input = screen.getByTestId("date-picker-input");
    expect(input).toBeInTheDocument();
    expect(input).not.toBeRequired();

    const marker = screen.queryByText("*");
    expect(marker).not.toBeInTheDocument();

  });

  test("renders DatePicker with Label error prop", () => {
    render(<DatePicker label="Error Prop" id="test-error" error />);
    const label = screen.getByTestId("label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass("usa-label--error");
  });

  test("renders DatePicker with Label srOnly prop", () => {
    render(<DatePicker label="srOnly prop" id="test-sronly" srOnly />);
    const label = screen.getByTestId("label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass("usa-sr-only");
  });

  test("renders DatePicker appropriately with passed ref", () => {
    let testRef;
    const Parent = () => {
      testRef = useRef(null);
      return (
        <DatePicker
          id="date-picker-with-ref"
          name="datePickerWithRef"
          label="DatePicker with Ref"
          inputRef={testRef}
        />
      )
    }
    render(<Parent />);

    const parentRef = testRef;

    expect(parentRef.current).toBeInTheDocument();
    expect(parentRef.current.tagName).toBe('INPUT');
  });

  test("renders DatePicker with hint text", () => {
    render(<DatePicker label="Include label hint" id="date-picker-hint" hint="(Optional)" />)
    const hint = screen.getByText("(Optional)");
    expect(hint).toBeInTheDocument();
    expect(hint).toHaveClass("usa-hint");
  });

});
