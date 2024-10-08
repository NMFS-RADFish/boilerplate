import "./index.css";
import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import HomePage from "./pages/Home";
import { GridContainer } from "@trussworks/react-uswds";
import { Application } from "@nmfs-radfish/react-radfish";

const App = () => {
  return (
    <Application>
      <GridContainer>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Router>
      </GridContainer>
    </Application>
  );
};

export default App;
