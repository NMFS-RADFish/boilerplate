import "./index.css";
import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import { ComputedForm } from "./pages/Form";
import { Alert } from "@trussworks/react-uswds";

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
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
    <Alert type="info" headingLevel={"h1"} heading="Computed Form Fields">
      This is an example of a form with form inputs that compute the values of other form inputs.
    </Alert>
  );
};

export default App;
