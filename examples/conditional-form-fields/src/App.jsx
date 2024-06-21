import "./index.css";
import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import { ConditionalForm } from "./pages/Form";
import { Alert, Button, Link } from "@trussworks/react-uswds";
import { Toast } from "@nmfs-radfish/react-radfish";
import { useToast, TOAST_CONFIG, TOAST_LIFESPAN } from "./hooks/useToast";

function App() {
  const { toast, showToast, dismissToast } = useToast();

  const handleToastMessage = () => {
    showToast(TOAST_CONFIG.SUCCESS);
    setTimeout(() => {
      dismissToast();
    }, TOAST_LIFESPAN);
  };

  return (
    <div className="App">
      {toast && (
        <Toast
          toast={{
            status: "success",
            message: "Successful form submission",
          }}
        />
      )}
      <Layout>
        <h1>Conditional Form Fields Example</h1>
        <FormInfoAnnotation />
        <Router>
          <Routes>
            <Route path="/" element={<ConditionalForm handleToastMessage={handleToastMessage} />} />
          </Routes>
        </Router>
      </Layout>
    </div>
  );
}

const FormInfoAnnotation = () => {
  return (
    <Alert type="info" headingLevel={"h2"} heading="Information">
      This is an example of a form with form inputs that control the visibility of other fields. In
      this example, the "Nickname" field appears whenever "Full Name" contains a value.
      <br />
      <br />
      Note, that this does not check if the name is valid or not (only that it exists). For form
      field validators, please see the `field-validators` example.
      <br />
      <br />
      <Link
        href="https://nmfs-radfish.github.io/documentation"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button type="button">Go To Documentation</Button>
      </Link>
    </Alert>
  );
};

export default App;
