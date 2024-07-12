import "./index.css";
import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { MultiStepForm } from "./pages/Form";
import { Alert, Button, Link } from "@trussworks/react-uswds";

function App() {
  return (
    <div className="App grid-container">
      <h1>Multi-Step</h1>
      <FormInfoAnnotation />
      <br />
      <Router>
        <Routes>
          <Route path="/" element={<MultiStepForm />} />
          <Route path="/:id" element={<MultiStepForm />} />
        </Routes>
      </Router>
    </div>
  );
}

const FormInfoAnnotation = () => {
  return (
    <Alert type="info" headingLevel={"h2"} heading="Information">
      This is an example of a multistep form, where the form needs to keep track of the current step
      that the user is on. This current step should persist through refresh, along with the data for
      that specific form, on the correct step.
      <br />
      <br />
      <strong>Note:</strong> Annotations are for informational purposes only. In production, you
      would remove the annotations. Components with annotations above them are optional. You can
      choose whether or not to use them in your application.
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
