import React from "react";
import { GridContainer } from "@trussworks/react-uswds";
import HeaderNav from "./HeaderNav";

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
        <a href="/">Home</a>
        <a href="/">About</a>
      </HeaderNav>
      <GridContainer>{children}</GridContainer>;
    </>
  );
};

export default Layout;
