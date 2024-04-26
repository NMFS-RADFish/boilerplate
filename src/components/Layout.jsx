import React from "react";
import { GridContainer } from "@trussworks/react-uswds";
import HeaderNav from "./HeaderNav";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <>
      <HeaderNav>
        <Link to="/">Home</Link>
        <Link to="/complexform">Complex Form</Link>
        <Link to="/multistep">Multi-Step Form</Link>
        <Link to="/table">Table</Link>
      </HeaderNav>
      <GridContainer>{children}</GridContainer>
    </>
  );
};

export default Layout;
