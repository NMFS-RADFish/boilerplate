import "./index.css";
import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import { Alert, Button, Link } from "@trussworks/react-uswds";
import { FieldValidatorForm } from "./pages/Form";

function App() {
  return (
    <div className="App">
      <Layout>
        <h1>Field Validators</h1>
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
      This is an example of a form with form inputs that handle input validation. If the Full Name
      input includes a number, the validator will return false and display the error
      <br />
      <br />
      To see where the validators are defined, you can visit `/utilities/fieldValidators.js`. Note
      that you can handle several different validation test cases within each validation array.
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
}

export default App;
