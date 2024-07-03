import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import * as formWrapper from "../../contexts/FormWrapper.example";
import * as reactRouter from "react-router-dom";

// Mocking react-router-dom hooks
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: vi.fn(),
  useSearchParams: vi.fn(() => [new URLSearchParams(), vi.fn()]),
}));

vi.mock("../../contexts/FormWrapper", async () => {
  return {
    ...(await vi.importActual("../../contexts/FormWrapper")),
    useFormState: vi.fn(),
  };
});

vi.mock("../../packages/contexts/OfflineStorageWrapper.jsx", async () => {
  return {
    ...(await vi.importActual("../../packages/contexts/OfflineStorageWrapper.jsx")),
    useOfflineStorage: vi.fn(),
  };
});

// Mocking the computePriceFromQuantitySpecies function
vi.mock("../../utilities", async () => ({
  ...(await vi.importActual("../../utilities")),
  computePriceFromQuantitySpecies: vi.fn(),
}));

const validationMessage = "Test validation message";

describe("FormWrapper", () => {
  it("renders children and passes context values correctly", async () => {
    const mockedValidationErrors = { species: validationMessage };
    const mockedUseSearchParams = vi.fn(() => [new URLSearchParams(), vi.fn()]);
    const mockedHandleChange = vi.fn();
    const mockedHandleBlur = vi.fn();
    const mockedUseFormState = vi.fn(() => ({
      formData: {},
      validationErrors: mockedValidationErrors,
      handleChange: mockedHandleChange,
      handleBlur: mockedHandleBlur,
    }));
    const mockedUseOfflineStorage = vi.fn(() => {
      return {
        findOfflineData: vi.fn(),
      };
    });

    vi.spyOn(reactRouter, "useSearchParams").mockImplementation(mockedUseSearchParams);
    vi.spyOn(formWrapper, "useFormState").mockImplementation(mockedUseFormState);

    const TestComponent = () => {
      const { handleChange, handleBlur, validationErrors, handleMultiEntrySubmit } =
        formWrapper.useFormState();
      return (
        <div>
          <input
            data-testid="inputId"
            type="text"
            name="species"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {validationErrors.species && (
            <span data-testid="validation-error">{validationMessage}</span>
          )}
          <button onClick={() => handleMultiEntrySubmit({ species: "Mock Species" })}>
            Submit
          </button>
        </div>
      );
    };

    const { getByText, getByTestId } = render(
      <formWrapper.FormWrapper>
        <TestComponent />
      </formWrapper.FormWrapper>,
    );

    // Get the input element
    const inputElement = getByTestId("inputId");

    // Simulate change event by updating input value
    fireEvent.change(inputElement, { target: { value: "New Species" } });
    expect(mockedHandleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: "New Species",
        }),
      }),
    );
    fireEvent.blur(inputElement);
    expect(mockedHandleBlur).toHaveBeenCalled();
    expect(getByText(validationMessage)).toBeInTheDocument();
  });

  it("does not display validation error message when there is no error", async () => {
    const mockedValidationErrors = {};
    const mockedUseSearchParams = vi.fn(() => [new URLSearchParams(), vi.fn()]);
    const mockedHandleChange = vi.fn();
    const mockedHandleBlur = vi.fn();
    const mockedUseFormState = vi.fn(() => ({
      formData: {},
      validationErrors: mockedValidationErrors,
      handleChange: mockedHandleChange,
      handleBlur: mockedHandleBlur,
    }));

    vi.spyOn(reactRouter, "useSearchParams").mockImplementation(mockedUseSearchParams);
    vi.spyOn(formWrapper, "useFormState").mockImplementation(mockedUseFormState);

    const TestComponent = () => {
      const { handleChange, handleBlur, validationErrors, handleMultiEntrySubmit } =
        formWrapper.useFormState();
      return (
        <div>
          <input
            data-testid="inputId"
            type="text"
            name="species"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {validationErrors.species && (
            <span data-testid="validation-error">{validationMessage}</span>
          )}
          <button onClick={() => handleMultiEntrySubmit({ species: "Mock Species" })}>
            Submit
          </button>
        </div>
      );
    };

    const { queryByText } = render(
      <formWrapper.FormWrapper>
        <TestComponent />
      </formWrapper.FormWrapper>,
    );

    expect(queryByText(validationMessage)).not.toBeInTheDocument();
  });
});

describe("handleInputVisibility", () => {
  it("should update the visibility state of form inputs correctly", () => {
    const mockedVisibleInputs = {
      input1: true,
      input2: false,
    };
    const mockedUseSearchParams = vi.fn(() => [new URLSearchParams(), vi.fn()]);
    const mockedHandleChange = vi.fn((event) => {
      mockedVisibleInputs.input2 = event.target.value;
    });
    const mockedHandleBlur = vi.fn();
    const mockedUseFormState = vi.fn(() => ({
      formData: {
        conditionOne: "sample input text 1",
        conditionTwo: "sample input text 2",
      },
      visibleInputs: mockedVisibleInputs,
      handleChange: mockedHandleChange,
      handleBlur: mockedHandleBlur,
    }));

    vi.spyOn(reactRouter, "useSearchParams").mockImplementation(mockedUseSearchParams);
    vi.spyOn(formWrapper, "useFormState").mockImplementation(mockedUseFormState);

    // Mock form configuration data
    const FORM_CONFIG = {
      input1: {
        visibility: {
          callback: (args, formData) => formData.condition1 === "sample input text 1",
          args: [],
        },
      },
      input2: {
        visibility: {
          callback: (args, formData) => formData.condition2 === "sample input text 2",
          args: [],
        },
      },
    };

    const TestComponent = () => {
      const { formData, visibleInputs } = formWrapper.useFormState();
      return (
        <div>
          <input
            data-testid="input1"
            role="testinput"
            type="text"
            name="input1"
            value={formData.input1}
            onChange={mockedHandleChange}
          />
          {visibleInputs.input2 && (
            <input
              data-testid="input2"
              role="testinput"
              type="text"
              name="input2"
              value={formData.input2}
              onChange={() => {}}
            />
          )}
        </div>
      );
    };

    const { getByTestId, rerender } = render(
      <formWrapper.FormWrapper>
        <TestComponent />
      </formWrapper.FormWrapper>,
    );

    const visibleInputs = screen.queryAllByRole("testinput");
    expect(visibleInputs.length).toBe(1);

    fireEvent.change(getByTestId("input1"), { target: { value: true } });
    rerender(
      <formWrapper.FormWrapper>
        <TestComponent />
      </formWrapper.FormWrapper>,
    );

    const visibleInputs2 = screen.queryAllByRole("testinput");
    expect(visibleInputs2.length).toBe(2);
    expect(getByTestId("input2")).toBeDefined();
  });
});
