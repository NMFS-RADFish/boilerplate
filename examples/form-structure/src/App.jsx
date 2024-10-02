import "./index.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import { Application } from "@nmfs-radfish/react-radfish";
import {
  GridContainer,
  Title,
  NavMenuButton,
  PrimaryNav,
  Header,
} from "@trussworks/react-uswds";

import HomePage from "./pages/Home";
import FormPage from "./pages/Form";

function App() {
  const [isExpanded, setExpanded] = useState(false);
  return (
    <Application>
      <a className="usa-skipnav" href="#main-content">
        Skip to main content
      </a>
      <main id="main-content">
        <BrowserRouter>
          <Header
            basic={true}
            showMobileOverlay={isExpanded}
            className="header-container"
          >
            <div className="usa-nav-container">
              <div className="usa-navbar">
                <Title className="header-title">RADFish Application</Title>
                <NavMenuButton
                  onClick={() => setExpanded((prvExpanded) => !prvExpanded)}
                  label="Menu"
                />
              </div>
              <PrimaryNav
                items={[
                  <Link
                    to="/"
                    style={{ color: `${isExpanded ? "black" : "white"}` }}
                  >
                    Home
                  </Link>,
                  <Link
                    to="/form"
                    style={{ color: `${isExpanded ? "black" : "white"}` }}
                  >
                    Form
                  </Link>,
                ]}
                mobileExpanded={isExpanded}
                onToggleMobileNav={() =>
                  setExpanded((prvExpanded) => !prvExpanded)
                }
              ></PrimaryNav>
            </div>
          </Header>
          <GridContainer>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/form" element={<FormPage />} />
            </Routes>
          </GridContainer>
        </BrowserRouter>
      </main>
    </Application>
  );
}

export default App;
