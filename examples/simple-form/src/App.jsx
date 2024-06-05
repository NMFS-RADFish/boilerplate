import "./index.css";
import SimpleForm, { SimpleFormDetails } from "./pages/Form";

function App() {
  return (
    <div className="grid-container">
      <h1>Simple Form Examples</h1>
      <SimpleForm />
      <SimpleFormDetails />
    </div>
  );
}

export default App;
