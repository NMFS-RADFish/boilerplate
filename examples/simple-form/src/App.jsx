import "./index.css";
import { useOfflineStorage } from "./packages/contexts/OfflineStorageWrapper";
import { FormWrapper } from "./contexts/FormWrapper";
import SimpleForm, { SimpleFormDetails } from "./pages/Form";

function App() {
  const { createOfflineData } = useOfflineStorage();

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = {};

    for (let [key, value] of formData.entries()) {
      values[key] = value;
    }

    createOfflineData("formData", values);
    // Handle form submission, usually by sending a POST request to a server
    // Example: fetch.post("/api/form", values)
    console.log("Form submitted");
  };

  return (
    <div className="grid-container">
      <h1>Simple Form Examples</h1>
      <FormWrapper onSubmit={handleOnSubmit}>
        <SimpleForm />
      </FormWrapper>
      <FormWrapper onSubmit={handleOnSubmit}>
        <SimpleFormDetails />
      </FormWrapper>
    </div>
  );
}

export default App;
