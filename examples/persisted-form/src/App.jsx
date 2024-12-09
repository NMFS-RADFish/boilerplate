import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Alert, Link, Button, GridContainer } from "@trussworks/react-uswds";
import { Application } from "@nmfs-radfish/react-radfish";
import HomePage from "./pages/Home";

function App() {
  return (
    <Application>
      <GridContainer>
        <h1>Persisted Form Example</h1>
        <FormInfoAnnotation />
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/:id" element={<HomePage />} />
          </Routes>
        </Router>
      </GridContainer>
    </Application>
  );
}

const FormInfoAnnotation = () => {
  return (
    <Alert type="info" heading="Information" headingLevel="h2">
      This is an example of a live form with data populated from IndexDB. The form data is stored in
      the browser's IndexedDB using methods from the <strong>useOfflineStorage</strong> hook, which uses
      Dexie.js behind the scenes.
      <br />
      <br />
      Please note that in order to see the form data persist, you must include the form record's
      UUID in the browser URL. This will happen automatically when you submit the form from the
      initial example
      <br />
      <br />
      This example can be helpful when you want to hydrate page state using data from a persistent
      store like IndexDB or a remote API
      <br />
      <br />
      <Link href="https://nmfs-radfish.github.io/radfish" target="_blank" rel="noopener noreferrer">
        <Button type="button">Go To Documentation</Button>
      </Link>
      <Link
        href="https://dexie.org/docs/Tutorial/Getting-started"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button type="button">Dexie Docs</Button>
      </Link>
    </Alert>
  );
};

export default App;
