import React, { useState } from "react";
import Logo from "../assets/noaalogo.png";
import { Header, NavMenuButton, PrimaryNav, Search, Title } from "@trussworks/react-uswds";

const HeaderNav = ({ children }) => {
  const [expanded, setExpanded] = useState(false);
  const onClick = () => setExpanded((prvExpanded) => !prvExpanded);

  return (
    <>
      <div
        className={`usa-overlay ${expanded ? "is-visible" : ""}`}
        onClick={() => (expanded ? setExpanded(false) : null)}
      ></div>
      <Header basic={true}>
        <div className="usa-nav-container">
          <div className="usa-navbar">
            <Title>
              <img src={Logo} alt="logo" id="logo" />
            </Title>
            <NavMenuButton onClick={onClick} label="Menu" />
          </div>
          <PrimaryNav items={children} mobileExpanded={expanded} onToggleMobileNav={onClick}>
            <Search size="small" onSubmit={() => null} />
          </PrimaryNav>
        </div>
      </Header>
    </>
  );
};

export default HeaderNav;
