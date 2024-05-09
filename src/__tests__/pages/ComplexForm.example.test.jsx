import React from "react";
import { render, fireEvent } from "@testing-library/react";
import * as formWrapper from "../../contexts/FormWrapper.example";
import { ComplexForm } from "../../pages/ComplexForm.example";
import * as offlineWrapper from "../../packages/contexts/OfflineStorageWrapper";

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

describe("ComplexForm", () => {
  it("renders and fires events", async () => {
    const mockedHandleChange = vi.fn();
    const mockedHandleBlur = vi.fn();
    const mockedUseFormState = vi.fn(() => ({
      formData: {},
      validationErrors: {},
      handleChange: mockedHandleChange,
      handleBlur: mockedHandleBlur,
      visibleInputs: {},
    }));
    const mockedUseOfflineStorage = vi.fn(() => {
      return {
        updateOfflineData: vi.fn(),
      };
    });

    vi.spyOn(formWrapper, "useFormState").mockImplementation(mockedUseFormState);
    vi.spyOn(offlineWrapper, "useOfflineStorage").mockImplementation(mockedUseOfflineStorage);

    const { getByTestId } = render(
      <formWrapper.FormWrapper>
        <ComplexForm />
      </formWrapper.FormWrapper>,
    );

    const inputElement = getByTestId("inputId");

    fireEvent.change(inputElement, { target: { value: "Mock Input Value" } });
    expect(mockedHandleChange).toHaveBeenCalled();
    fireEvent.blur(inputElement);
    expect(mockedHandleBlur).toHaveBeenCalled();
  });
});
