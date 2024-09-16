import "./index.css";
import React, { useEffect } from "react";
import { Alert, Button, Link } from "@trussworks/react-uswds";
import {
  TableBody,
  TableBodyRow,
  TableHeaderCell,
  TableHeader,
  TableHeaderRow,
  TableBodyCell,
  TablePaginationNav,
  TablePaginationPageCount,
  TablePaginationGoToPage,
  TablePaginationSelectRowCount,
  dispatchToast,
} from "@nmfs-radfish/react-radfish";
import { Table, useOfflineStatus } from "@nmfs-radfish/react-radfish";
import { useTableState } from "./packages/contexts/TableWrapper";
import { useOfflineStorage } from "@nmfs-radfish/react-radfish";

// mockData is used to populate the table with data, usually this would come from an API call.
const mockData = [
  {
    uuid: "uuid-123",
    isDraft: true,
    fullName: "Samwise Gamgee",
    species: "Marlin",
    computedPrice: 50,
    image: "https://picsum.photos/200/300",
  },
  {
    uuid: "uuid-456",
    isDraft: false,
    fullName: "Galadriel",
    species: "Mahimahi",
    computedPrice: 1000,
    image: "https://picsum.photos/200/300",
  },
  {
    uuid: "uuid-789",
    isDraft: false,
    fullName: "Frodo Baggins",
    species: "Grouper",
    computedPrice: 80,
    image: "https://picsum.photos/200/300",
  },
];

function App() {
  const { table, headerNames, rowModel, setData } = useTableState();
  const { findOfflineData, updateOfflineData } = useOfflineStorage();
  const { isOffline } = useOfflineStatus();

  const seedTableData = async () => {
    await updateOfflineData("formData", mockData);
    const data = await findOfflineData("formData");
    setData(data);
  };

  const handleSubmit = async (e, draftData) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      if (!isOffline) {
        await updateOfflineData("formData", [
          { ...draftData, uuid: draftData.uuid, isDraft: false },
        ]);
        dispatchToast({ message: "Online Form Submission", status: "success" });
      } else {
        await updateOfflineData("formData", [
          { uuid: draftData.uuid, isDraft: true, ...draftData },
        ]);
        dispatchToast({ message: "Offline Form Submission", status: "warning" });
      }
    } catch (error) {
      dispatchToast({ message: "Form Submission Error", status: "error" });
    } finally {
      const data = await findOfflineData("formData");
      setData(data);
    }
  };

  const data = [
    { Name: "Alice", Age: 32 },
    { Name: "Bob", Age: 28 },
    { Name: "Charlie", Age: 22 },
  ];

  const columns = [
    { key: "Name", label: "Name", sortable: true },
    { key: "Age", label: "Age", sortable: true },
  ];

  const onPageChange = () => {
    console.log("onPageChange called");
  };

  return (
    <div className="grid-container">
      <h1>Simple Table Example</h1>
      <InfoAnnotation />
      <br />
      <Button type="button" onClick={seedTableData}>
        Seed Table Data
      </Button>
      {/* <Table bordered fullWidth fixed></Table> */}
      <Table
        data={data}
        columns={columns}
        paginationOptions={{
          pageSize: 2,
          currentPage: 1,
          onPageChange: onPageChange,
          totalRows: data.length,
        }}
      />
      ,
      <Alert type="info" slim={true}>
        Below are examples of the different pagination components available. Each component is
        optional and can be used as needed. Components can be found in the `react-radfish`
        directory.
      </Alert>
    </div>
  );
}

function InfoAnnotation() {
  return (
    <Alert type="info" headingLevel={"h2"} heading="Information">
      Below is an example of a table that's populated by server and locally stored data
      (localStorage or indexedDB). The table is designed to be used with the{" "}
      <code>TableWrapper</code> component, it's built with{" "}
      <a
        href="https://tanstack.com/table/latest/docs/introduction"
        target="_blank"
        rel="noopener noreferrer"
      >
        react-table
      </a>
      .
      <br />
      <br />
      Offline form data entries or "drafts" are highlighted in grey, and can be submitted to the
      server using the "submit" button in the "status" column when the application is connected to
      the internet.
      <br />
      <br />
      <strong>Note:</strong> Annotations are for informational purposes only. In production, you
      would remove the annotations. Components with annotations above them are optional. You can
      choose whether or not to use them in your application.
      <br />
      <br />
      <Link
        href="https://nmfs-radfish.github.io/documentation/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button type="button">Go To Documentation</Button>
      </Link>
      <Link
        href="https://tanstack.com/table/latest/docs/introduction"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button type="button">React Table</Button>
      </Link>
    </Alert>
  );
}

export default App;
