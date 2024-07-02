import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Alert, Link, Button } from "@trussworks/react-uswds";
import { PersistedForm } from "./pages/Form";

function App() {
  return (
    <div className="App">
      <div className="grid-container">
        <h1>Persisted Form Example</h1>
        <FormInfoAnnotation />
        <Router>
          <Routes>
            <Route path="/" element={<PersistedForm />} />
            <Route path="/:id" element={<PersistedForm />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

const FormInfoAnnotation = () => {
  return (
    <Alert type="info" heading="Information" headingLevel="h2">
      This is an example of a live form with data populated from IndexDB. The form data is stored in
      the browser's IndexedDB using methods from the <code>useOfflineStorage</code> hook, which uses
      Dexie.js behind the scenes.
      <br />
      <br />
      Please note that in order to see the form data persist, you must include the form record's
      UUID in the browser URL. This will happen automatically when you submit the form from the
      initial example
      <br />
      <br />
      This example can be helpful when you want to hydrate page state using data from a persistent
      store like IndexDB or a remote API” Copy Update: “Price (Dollars)” for input label
      <br />
      <br />
      <Link
        href="https://nmfs-radfish.github.io/documentation"
        target="_blank"
        rel="noopener noreferrer"
      >
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
