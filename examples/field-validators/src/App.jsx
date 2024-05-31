import "./index.css";
import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import { Alert } from "@trussworks/react-uswds";
import { FieldValidatorForm } from "./pages/Form";

function App() {
  return (
    <div className="App">
      <FormInfoAnnotation />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<FieldValidatorForm />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

function FormInfoAnnotation() {
  return (
    <Alert type="info" headingLevel={"h1"} heading="Example Form">
      This is an example of a form with form inputs that handle input validation. If a fullName
      input includes a number, the validator will return false and display the error
      <br />
      <br />
      <strong>Note:</strong> Annotations are for informational purposes only. In production, you
      would remove the annotations. Components with annotations above them are optional. You can
      choose whether or not to use them in your application.
    </Alert>
  );
}

export default App;
