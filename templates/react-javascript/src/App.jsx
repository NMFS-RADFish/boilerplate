/**
 * App.jsx - Main Application Component
 *
 * Welcome to RADFish! This is the entry point for your application.
 *
 * This file sets up:
 *   - The Application wrapper (provides offline storage, state management)
 *   - Header with navigation
 *   - React Router for page routing
 *
 * Quick Start:
 *   1. Add new pages in src/pages/
 *   2. Add routes in the <Routes> section below
 *   3. Add navigation links in the PrimaryNav items array
 *
 * Theme customization:
 *   - Edit themes/noaa-theme/styles/theme.scss for colors and styles
 *   - App name and icons are configured in the theme plugin (vite.config.js)
 *
 * Learn more: https://nmfs-radfish.github.io/radfish/
 */

import "./index.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import { Application } from "@nmfs-radfish/react-radfish";
import {
  GridContainer,
  NavMenuButton,
  PrimaryNav,
  Header,
} from "@trussworks/react-uswds";

import HomePage from "./pages/Home";

function App({ application }) {
  const [isExpanded, setExpanded] = useState(false);

  return (
    <Application application={application}>
      <a className="usa-skipnav" href="#main-content">
        Skip to main content
      </a>
      <main id="main-content">
        <BrowserRouter>
          {/* Header - Uses USWDS Header component */}
          <Header
            basic
            showMobileOverlay={isExpanded}
            className="header-container"
          >
            <div className="usa-nav-container">
              <div className="usa-navbar">
                <Link to="/" className="header-logo-link">
                  <img
                    src={import.meta.env.RADFISH_LOGO}
                    alt={import.meta.env.RADFISH_APP_NAME}
                    className="header-logo"
                  />
                </Link>
                <NavMenuButton
                  onClick={() => setExpanded((prev) => !prev)}
                  label="Menu"
                />
              </div>

              {/* Navigation - Add your nav links here */}
              <PrimaryNav
                items={[
                  <Link
                    key="home"
                    to="/"
                    style={{ color: isExpanded ? "black" : "white" }}
                  >
                    Home
                  </Link>,
                  // Add more navigation links here:
                  // <Link key="about" to="/about" style={{ color: isExpanded ? "black" : "white" }}>About</Link>,
                ]}
                mobileExpanded={isExpanded}
                onToggleMobileNav={() => setExpanded((prev) => !prev)}
              />
            </div>
          </Header>

          {/* Main Content Area */}
          <GridContainer>
            <Routes>
              <Route path="/" element={<HomePage />} />
              {/* Add more routes here:
                  <Route path="/about" element={<AboutPage />} />
              */}
            </Routes>
          </GridContainer>
        </BrowserRouter>
      </main>
    </Application>
  );
}

export default App;
