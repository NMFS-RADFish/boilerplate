import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SimpleTable } from "../../pages/Table.example";
import * as tableWrapper from "../../contexts/TableWrapper.example";
import * as tanstackTable from "@tanstack/react-table";
import Dexie from "dexie";
import { generateUUID } from "../../utilities/cryptoWrapper.js";
import { IndexedDBMethod } from "../../packages/storage/IndexedDBMethod.js";
import * as offlineWrapper from "../../packages/contexts/OfflineStorageWrapper";

global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: vi.fn().mockResolvedValue({
    data: [],
  }),
});

vi.mock("dexie");
vi.mock("../../utilities/cryptoWrapper.js");

vi.mock("../../packages/storage/indexedDB.js", () => ({
  db: {
    formData: {
      add: vi.fn(),
      toArray: vi.fn(),
      where: vi.fn(),
      bulkPut: vi.fn(),
      bulkDelete: vi.fn(),
    },
  },
}));

vi.mock("../../packages/contexts/OfflineStorageWrapper.jsx", async () => {
  return {
    ...(await vi.importActual("../../packages/contexts/OfflineStorageWrapper.jsx")),
    useOfflineStorage: vi.fn(),
  };
});

const mockedUseNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockedUseNavigate,
  useSearchParams: vi.fn(() => [new URLSearchParams(), vi.fn()]),
}));

vi.mock("@tanstack/react-table", async () => ({
  ...(await vi.importActual("@tanstack/react-table")),
  flexRender: vi.fn(),
}));

const tableMock = {
  getState: vi.fn(() => {
    return {
      pagination: {
        pageIndex: 0,
      },
    };
  }),
  getPageCount: vi.fn(),
  getCanPreviousPage: vi.fn(),
  getCanNextPage: vi.fn(),
};

const rowModelMock = {
  rows: [
    {
      id: "",
      species: "",
      numberOfFish: 10,
      original: {
        isOffline: false,
      },
      getVisibleCells: vi.fn(() => [
        {
          id: "",
          getContext: vi.fn(() => ""),
          column: {
            id: "",
            columnDef: {},
          },
        },
      ]),
    },
  ],
};

const mockHeader = {
  id: 1,
  column: {
    getCanSort: vi.fn(),
    getToggleSortingHandler: vi.fn(),
    columnDef: {
      header: "",
    },
  },
};

vi.mock("../../contexts/TableWrapper.example", async () => {
  return {
    ...(await vi.importActual("../../contexts/TableWrapper.example")),
    useTableState: vi.fn(() => {
      return {
        tableCaption: "Mock Table Caption",
        table: tableMock,
        headerNames: [mockHeader],
        rowModel: rowModelMock,
        setData: vi.fn(),
        showOfflineSubmit: vi.fn(),
        setShowOfflineSubmit: vi.fn(),
      };
    }),
  };
});

Dexie.mockImplementation(() => ({
  version: vi.fn().mockReturnThis(),
  stores: vi.fn().mockReturnThis(),
  formData: {
    add: vi.fn(),
    toArray: vi.fn(),
    where: vi.fn().mockReturnThis(),
    bulkPut: vi.fn(),
    bulkDelete: vi.fn(),
  },
}));

describe("Table", () => {
  let indexedDBMethod;
  let mockData;

  beforeEach(() => {
    // Mock Dexie
    Dexie.mockImplementation(() => ({
      version: vi.fn().mockReturnThis(),
      stores: vi.fn().mockReturnThis(),
      formData: {
        add: vi.fn(),
        toArray: vi.fn(),
        where: vi.fn().mockReturnThis(),
        bulkPut: vi.fn(),
        bulkDelete: vi.fn(),
      },
    }));

    // Mock generateUUID
    generateUUID.mockReturnValue("");

    indexedDBMethod = new IndexedDBMethod("", 1, {
      formData: "",
    });
    mockData = { key: "" };
  });

  test("Render table with data", async () => {
    const mockedUseOfflineStorage = vi.fn(() => {
      return {
        updateOfflineData: vi.fn(),
        findOfflineData: vi.fn(),
        createOfflineData: vi.fn(),
        deleteOfflineData: vi.fn(),
      };
    });

    vi.spyOn(offlineWrapper, "useOfflineStorage").mockImplementation(mockedUseOfflineStorage);

    const spy = vi.spyOn(tanstackTable, "flexRender");
    spy.mockReturnValue("cell value");

    const { queryByText, container } = render(
      <tableWrapper.TableWrapper>
        <SimpleTable />
      </tableWrapper.TableWrapper>,
    );

    const tableCaption = queryByText("Mock Table Caption");
    const tapleCaptionText = tableCaption.innerHTML;

    const tableHeaderElems = container.querySelectorAll("th");
    const tableCellElems = container.querySelectorAll("td");

    const tableRow = screen.queryByTestId("table-body-row");
    userEvent.click(tableRow);

    expect(tableCaption).not.toBeNull();
    expect(tapleCaptionText).toBe("Mock Table Caption");
    expect(tableHeaderElems.length).toBe(1);
    expect(tableCellElems.length).toBe(1);
    expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
  });
});
