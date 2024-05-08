import React from "react";
import { render, fireEvent } from "@testing-library/react";
import * as formWrapper from "../../contexts/FormWrapper.example";
import { MultiStepForm } from "../../pages/MultiStepForm.example";
import Dexie from "dexie";
import * as offlineWrapper from "../../packages/contexts/OfflineStorageWrapper";

vi.mock("dexie");
vi.mock("../../utilities/cryptoWrapper.js");
vi.mock("../../storage/indexedDB.js", () => ({
  db: {
    formData: {
      toArray: vi.fn(),
      where: vi.fn(),
      bulkPut: vi.fn(),
    },
  },
}));
vi.mock("../../packages/contexts/OfflineStorageWrapper.jsx", async () => {
  return {
    ...(await vi.importActual("../../packages/contexts/OfflineStorageWrapper.jsx")),
    useOfflineStorage: vi.fn(),
  };
});

const mockBulkPut = vi.fn();
Dexie.mockImplementation(() => ({
  version: vi.fn().mockReturnThis(),
  stores: vi.fn().mockReturnThis(),
  formData: {
    toArray: vi.fn(),
    where: vi.fn().mockReturnThis(),
    bulkPut: mockBulkPut,
  },
}));

// Mocking react-router-dom hooks
const mockUseNavigate = vi.fn();
const mockUseParams = { id: "12345" };
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockUseNavigate,
  useSearchParams: vi.fn(() => [new URLSearchParams(), vi.fn()]),
  useParams: () => mockUseParams,
}));

describe("MultiStepForm", () => {
  it("renders and renders step 1 when currentStep is 1, updates offline store", async () => {
    const mockedUseFormState = vi.fn(() => ({
      formData: {
        currentStep: 1,
      },
      validationErrors: {},
      handleChange: vi.fn(),
      setFormData: vi.fn(),
    }));
    const mockedUseOfflineStorage = vi.fn(() => {
      return {
        updateOfflineData: vi.fn(),
        findOfflineData: vi.fn(() => [{ uuid: "12345" }]),
      };
    });

    vi.spyOn(formWrapper, "useFormState").mockImplementation(mockedUseFormState);
    vi.spyOn(offlineWrapper, "useOfflineStorage").mockImplementation(mockedUseOfflineStorage);

    const { getByTestId, getByText } = render(
      <offlineWrapper.OfflineStorageWrapper config={{ type: "indexDB" }}>
        <formWrapper.FormWrapper>
          <MultiStepForm />
        </formWrapper.FormWrapper>
      </offlineWrapper.OfflineStorageWrapper>,
    );
    const fullNameInput = getByText("Full Name");
    const stepForwardButton = getByTestId("step-forward");
    const stepBackwardButton = getByTestId("step-backward");

    expect(fullNameInput).toBeInTheDocument();
    fireEvent.click(stepForwardButton);
    fireEvent.click(stepBackwardButton);
  });
});
