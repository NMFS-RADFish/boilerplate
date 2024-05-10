import React from "react";
import { render, fireEvent } from "@testing-library/react";
import * as formWrapper from "../../contexts/FormWrapper.example";
import { Form } from "../../pages/Form.example";
import * as offlineWrapper from "../../packages/contexts/OfflineStorageWrapper";
import * as reactRouter from "react-router-dom";

vi.mock("react-router-dom", async () => {
  const actualReactRouterDom = await vi.importActual("react-router-dom");
  return {
    ...actualReactRouterDom,
    useNavigate: () => vi.fn(),
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  };
});

function setupMocks() {
  const mockedHandleChange = vi.fn();
  const mockedHandleBlur = vi.fn();
  const mockedUseFormState = vi.fn(() => ({
    formData: {},
    validationErrors: {},
    handleChange: mockedHandleChange,
    handleBlur: mockedHandleBlur,
    visibleInputs: {},
  }));
  const mockedCreateOfflineData = vi.fn();
  const mockedUseOfflineStorage = vi.fn(() => ({
    updateOfflineData: vi.fn(),
    createOfflineData: mockedCreateOfflineData,
    findOfflineData: vi.fn(() => Promise.resolve([])),
  }));

  return {
    mockedHandleChange,
    mockedHandleBlur,
    mockedUseFormState,
    mockedCreateOfflineData,
    mockedUseOfflineStorage,
  };
}

describe("Form", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it("renders and fires events with id", async () => {
    const { mockedHandleBlur, mockedUseFormState, mockedUseOfflineStorage } = setupMocks();
    const mockedkUseParams = () => ({ id: "123" });

    vi.spyOn(formWrapper, "useFormState").mockImplementation(mockedUseFormState);
    vi.spyOn(offlineWrapper, "useOfflineStorage").mockImplementation(mockedUseOfflineStorage);
    vi.spyOn(reactRouter, "useParams").mockImplementation(mockedkUseParams);

    const { getByTestId } = render(
      <formWrapper.FormWrapper>
        <Form />
      </formWrapper.FormWrapper>,
    );

    const inputElement = getByTestId("inputId");
    fireEvent.change(inputElement, { target: { value: "Mock Input Value" } });
    fireEvent.blur(inputElement);
    expect(mockedHandleBlur).toHaveBeenCalled();
  });

  it("renders and fires events without id", async () => {
    const { mockedUseFormState, mockedCreateOfflineData, mockedUseOfflineStorage } = setupMocks();
    const mockedkUseParams = () => ({});

    vi.spyOn(formWrapper, "useFormState").mockImplementation(mockedUseFormState);
    vi.spyOn(offlineWrapper, "useOfflineStorage").mockImplementation(mockedUseOfflineStorage);
    vi.spyOn(reactRouter, "useParams").mockImplementation(mockedkUseParams);

    const { getByTestId } = render(
      <formWrapper.FormWrapper>
        <Form />
      </formWrapper.FormWrapper>,
    );

    const inputElement = getByTestId("init-complex");
    fireEvent.click(inputElement);
    expect(mockedCreateOfflineData).toHaveBeenCalled();
  });
});
