import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Title, Header, PrimaryNav, NavMenuButton } from "@trussworks/react-uswds";

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
  let location = useLocation();
  const [isExpanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [location]);

  return (
    <div>
      <div
        className={`usa-overlay ${isExpanded ? "is-visible" : ""}`}
        onClick={() => (isExpanded ? setExpanded(false) : null)}
      ></div>
      <Header basic={true} showMobileOverlay={isExpanded}>
        <div className="usa-nav-container">
          <div className="usa-navbar">
            <Title>RADFish Application</Title>
            <NavMenuButton
              onClick={() => setExpanded((prvExpanded) => !prvExpanded)}
              label="Menu"
            />
          </div>
          <PrimaryNav
            items={children}
            mobileExpanded={isExpanded}
            onToggleMobileNav={() => setExpanded((prvExpanded) => !prvExpanded)}
          ></PrimaryNav>
        </div>
      </Header>
    </div>
  );
};

export default HeaderNav;
