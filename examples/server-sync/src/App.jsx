import "./index.css";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Layout from "./components/Layout";

import { ServerSync } from "./components/ServerSync";

function App() {
  return (
    // Remove app div
    // Remove header
    <div className="App">
      <Router>
        <Layout>
          <ServerSync />
        </Layout>
      </Router>
    </div>
  );
}

export default App;
