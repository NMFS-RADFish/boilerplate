import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/theme.css";
import App from "./App";
import { OfflineStorageWrapper } from "./packages/contexts/OfflineStorageWrapper";
import { TableWrapper } from "./packages/contexts/TableWrapper";
import { createColumnHelper } from "@tanstack/react-table";

const offlineStorageConfig = {
  type: "indexedDB",
  name: import.meta.env.VITE_INDEXED_DB_NAME,
  version: import.meta.env.VITE_INDEXED_DB_VERSION,
  stores: {
    formData: "uuid, fullName, numberOfFish, species, computedPrice, isDraft",
  },
};

const columnHelper = createColumnHelper();

const columnMap = [
  columnHelper.accessor("isDraft", {
    cell: (info) => (info.getValue() ? "Draft " : "Submitted"),
    header: () => <span>Status</span>,
  }),
  columnHelper.accessor("uuid", {
    cell: (info) => info.getValue(),
    header: () => <span>Id</span>,
  }),
  columnHelper.accessor("species", {
    cell: (info) => info.getValue(),
    header: () => <span>Species</span>,
  }),
  columnHelper.accessor("numberOfFish", {
    cell: (info) => info.getValue(),
    header: () => <span>Amount Caught</span>,
  }),
  columnHelper.accessor("computedPrice", {
    cell: (info) => info.getValue(),
    header: () => <span>Price</span>,
  }),
];

const pageSize = 10;

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ErrorBoundary>
    <React.StrictMode>
      <OfflineStorageWrapper config={offlineStorageConfig}>
        <TableWrapper columnMap={columnMap} pageSize={pageSize}>
          <App />
        </TableWrapper>
      </OfflineStorageWrapper>
    </React.StrictMode>
  </ErrorBoundary>
);
