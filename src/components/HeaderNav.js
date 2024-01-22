import React, { useState } from "react";
import { Header, NavMenuButton, PrimaryNav, Search, Title } from "@trussworks/react-uswds";
import Logo from "../assets/noaa-logo-circle.svg";
import "./HeaderNav.css";

/**
 * HeaderNav Component
 * @param children HTML `<a>` tag links, i.e. `<a href="/">Home</a>`
 * @returns Array of `<a>` tags [`<a href="#">linke one</a>`, `<a href="#">linke one</a>`]
 * 
 * The `HeaderNav` component can be used to display a navigation header. By default, this component is used within the `Layout` component. It is mobile responsive, and will convert to an expandable navigation menu with a hamburger icon on smaller screens.
 * 
 * Example usage:
    ```<HeaderNav>
        // add links here
        <a href="/">Home</a>
        <a href="/">About</a>
      </HeaderNav>```
 */

const HeaderNav = ({ children }) => {
  const [expanded, setExpanded] = useState(false);
  const onExpandNavMenuClick = () => setExpanded((prvExpanded) => !prvExpanded);

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
              <img src={Logo} alt="logo" className="header-logo" />
            </Title>
            <NavMenuButton onClick={onExpandNavMenuClick} label="Menu" />
          </div>
          <PrimaryNav
            items={children}
            mobileExpanded={expanded}
            onToggleMobileNav={onExpandNavMenuClick}
          >
            <Search size="small" onSubmit={() => null} />
          </PrimaryNav>
        </div>
      </Header>
    </>
  );
};

export default HeaderNav;
