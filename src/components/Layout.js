import React from "react";
import { GridContainer } from "@trussworks/react-uswds";
import HeaderNav from "./HeaderNav";
import { Link } from "react-router-dom";

/**
 * Layout Component
 * @param children React components
 * @returns React components
 * 
 * The `Layout` should be used as a top-level component, at the root of the application in `App.js`. This component ensures that all pages follow the same style guidelines such as responsiveness, margins, padding, etc.
 * 
 * Example usage:
    ```<div className="App">
        <Layout>
          <Component/>
          <OtherComponent/>
        </Layout>
      </div>```
 */

const Layout = ({ children }) => {
  return (
    <>
      <HeaderNav>
        <Link to="/">Home</Link>
        <Link to="/">About</Link>
        <Link to="/table">Table</Link>
      </HeaderNav>
      <GridContainer>{children}</GridContainer>;
    </>
  );
};

export default Layout;
