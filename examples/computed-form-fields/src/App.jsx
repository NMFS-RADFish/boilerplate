import "./index.css";
import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import { ComputedForm } from "./pages/Form";
import { Alert, Button } from "@trussworks/react-uswds";

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <h1>Computed Form Fields Example</h1>
          <FormInfoAnnotation />
          <Routes>
            <Route path="/" element={<ComputedForm />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

const FormInfoAnnotation = () => {
  return (
    <Alert type="info" headingLevel={"h2"} heading="Information">
      This is an example of a form with form inputs that compute the values of other form inputs.
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
};

export default App;
