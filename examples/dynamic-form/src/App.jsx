import "./index.css";
import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import { ConditionalForm } from "./pages/Form";

function App() {
  return (
    <div className="App">
      <Router>
          <Layout>
            <Routes>
              <Route
                path="/"
                element={<ConditionalForm />}
              />
            </Routes>
          </Layout>
      </Router>
    </div>
  );
}

export default App;
