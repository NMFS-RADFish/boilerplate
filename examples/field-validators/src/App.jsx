import "./index.css";
import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import { Alert } from "@trussworks/react-uswds";
import { FieldValidatorForm } from "./pages/Form";

function App() {
  return (
    <div className="App">
      <Layout>
        <h1>Form Field Validators Example</h1>
        <FormInfoAnnotation />
        <Router>
          <Routes>
            <Route path="/" element={<FieldValidatorForm />} />
          </Routes>
        </Router>
      </Layout>
    </div>
  );
}

function FormInfoAnnotation() {
  return (
    <Alert type="info" headingLevel={"h2"} heading="Information">
      This is an example of a form with form inputs that handle input validation. If a fullName
      input includes a number, the validator will return false and display the error
      <br />
      <br />
      <strong>Note:</strong> Annotations are for informational purposes only. In production, you
      would remove the annotations. Components with annotations above them are optional. You can
      choose whether or not to use them in your application.
      <br />
      <br />
      <a
        href="https://nmfs-radfish.github.io/documentation"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button type="button">Go To Documentation</Button>
      </a>
    </Alert>
  );
}

export default App;
