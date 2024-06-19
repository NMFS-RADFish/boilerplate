import "./index.css";
import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import { ConditionalForm } from "./pages/Form";
import { Alert, Button, Link } from "@trussworks/react-uswds";

function App() {
  return (
    <div className="App">
      <Layout>
        <h1>Conditional Form Fields Example</h1>
        <FormInfoAnnotation />
        <Router>
          <Routes>
            <Route path="/" element={<ConditionalForm />} />
          </Routes>
        </Router>
      </Layout>
    </div>
  );
}

const FormInfoAnnotation = () => {
  return (
    <Alert type="info" headingLevel={"h2"} heading="Information">
      This is an example of a form with form inputs that control the visibility of other fields.
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
