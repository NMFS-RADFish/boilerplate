import "./index.css";
import SimpleForm from "./pages/Form";
import { Alert, Link, Button } from "@trussworks/react-uswds";

function App() {
  return (
    <div className="App">
      <div className="grid-container">
        <FormInfoAnnotation />
        <Router>
          <Routes>
            <Route path="/" element={<SimpleForm />} />
            <Route path="/:id" element={<SimpleForm />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

const FormInfoAnnotation = () => {
  return (
    <Alert type="info" heading="Persisted Form Example" headingLevel="h1">
      This is an example of a form with details coming from IndexedDB. The form data is stored in
      the browser's IndexedDB using methods from the `useOfflineStorage` hook, which uses Dexie.js
      behind the scenes.
      <br />
      <br />
      Please note that the form below will only populate when you have data saved in IndexedDB.
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
