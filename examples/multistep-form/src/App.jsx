import "./index.css";
import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import { MultiStepForm } from "./pages/Form";

function App() {
  return (
    <div className="App">
      <Layout>
        <Router>
            <Routes>
              <Route
                path="/"
                element={<MultiStepForm />}
              />
              <Route
                path="/:id"
                element={<MultiStepForm />}
              />
            </Routes>
        </Router>
      </Layout>
    </div>
  );
}

export default App;
