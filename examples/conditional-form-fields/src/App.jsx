import "./index.css";
import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import { ConditionalForm } from "./pages/Form";
import { Alert } from "@trussworks/react-uswds";

function App() {
  return (
    <div className="App">
      <Layout>
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
    <Alert type="info" headingLevel={"h1"} heading="Conditional Form Fields">
      This is an example of a form with form inputs that control the visibility of other fields.
    </Alert>
  );
};

export default App;
