import React from "react";
import { render, fireEvent } from "@testing-library/react";
import * as formWrapper from "../../contexts/FormWrapper.example";
import { Form } from "../../pages/Form.example";

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

describe("Form", () => {
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

    vi.spyOn(formWrapper, "useFormState").mockImplementation(mockedUseFormState);

    const { getByTestId } = render(
      <formWrapper.FormWrapper>
        <Form />
      </formWrapper.FormWrapper>,
    );

    const inputElement = getByTestId("inputId");

    fireEvent.change(inputElement, { target: { value: "Mock Input Value" } });
    expect(mockedHandleChange).toHaveBeenCalled();
    fireEvent.blur(inputElement);
    expect(mockedHandleBlur).toHaveBeenCalled();
  });
});
