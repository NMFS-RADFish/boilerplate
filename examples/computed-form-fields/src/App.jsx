import "./index.css";
import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import { ComputedForm } from "./pages/Form";
import { Alert, Button, Link } from "@trussworks/react-uswds";

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
      In this example, the “Computed Price” is calculated by taking “Number of Fish” and multiplying
      it by the price for the selected “Species”. The price for each species is a mapping defined in
      the mock server response
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
