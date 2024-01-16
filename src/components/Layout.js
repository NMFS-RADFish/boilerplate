import React from "react";
import { GridContainer } from "@trussworks/react-uswds";
import HeaderNav from "./HeaderNav";

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
