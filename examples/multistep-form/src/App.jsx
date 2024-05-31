import "./index.css";
import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import { MultiStepForm } from "./pages/Form";
import { Alert } from "@trussworks/react-uswds";

function App() {
  return (
    <div className="App">
      <Layout>
        <FormInfoAnnotation />
        <Router>
          <Routes>
            <Route path="/" element={<MultiStepForm />} />
            <Route path="/:id" element={<MultiStepForm />} />
          </Routes>
        </Router>
      </Layout>
    </div>
  );
}

const FormInfoAnnotation = () => {
  return (
    <Alert type="info" headingLevel={"h1"} heading="Multistep Form">
      This is an example of a multistep form, where the form needs to keep track of the currentStep
      the user is on. This current step should persist through refresh, along with the data for that
      specific form, on the correct step.
    </Alert>
  );
};

export default App;
