import "./index.css";
import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import { ConditionalForm } from "./pages/Form";
import { Alert } from "@trussworks/react-uswds";

function App() {
  return (
    <div className="App">
      <Router>
        <Layout>
          <FormInfoAnnotation />
          <Routes>
            <Route path="/" element={<ConditionalForm />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

const FormInfoAnnotation = () => {
  return (
    <Alert type="info" headingLevel={"h1"} heading="Example Form">
      This is an example of a form with form inputs that control the visibility of other fields.
    </Alert>
  );
};

export default App;
