import "./index.css";
import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { Toast } from "@nmfs-radfish/react-radfish";
import { FormWrapper } from "./contexts/FormWrapper";
import Layout from "./components/Layout";
import { Form } from "./pages/Form";
import { TOAST_CONFIG, TOAST_LIFESPAN, useToast } from "./hooks/useToast";

function App() {
  const { toast, showToast, dismissToast } = useToast();

  const handleFormSubmit = async () => {
    showToast(TOAST_CONFIG.SUCCESS);
    setTimeout(() => {
      dismissToast();
    }, TOAST_LIFESPAN);
  };

  return (
    <Router>
      <div className="App">
        <div className="toast-container">
          <Toast toast={toast} />
        </div>
        <Layout>
          <Routes>
            <Route
              path="/"
              element={
                <FormWrapper onSubmit={handleFormSubmit}>
                  <Form />
                </FormWrapper>
              }
            />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
