import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Title, Tag } from "@trussworks/react-uswds";
import { Header, Navigation } from "@nmfs-radfish/react-radfish";
import { version } from "../../package.json";
import Logo from "../assets/noaa-logo-circle.svg";
import { ServerSync } from "./ServerSync";

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
  const [expanded, setExpanded] = useState(false);
  const onExpandNavMenuClick = () => setExpanded((prvExpanded) => !prvExpanded);

  useEffect(() => {
    setExpanded(false);
  }, [location]);

  return (
    <>
      <div
        className={`usa-overlay ${expanded ? "is-visible" : ""}`}
        onClick={() => (expanded ? setExpanded(false) : null)}
      ></div>
      <Header basic={true}>
        <Title>
          <img src={Logo} alt="logo" className="header-logo" />
          <Tag>{`v${version}`}</Tag>
        </Title>
        <Navigation items={children} expanded={expanded} onClick={onExpandNavMenuClick} />
      </Header>
    </>
  );
};

export default HeaderNav;
