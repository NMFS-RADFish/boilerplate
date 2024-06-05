import React from "react";
import { GridContainer } from "@trussworks/react-uswds";

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
  return <GridContainer>{children}</GridContainer>;
};

export default Layout;
