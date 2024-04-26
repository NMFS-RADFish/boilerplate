import React, { useState } from "react";
import { Title, Tag } from "@trussworks/react-uswds";
import { Header, Navigation } from "../packages/react-components";
import { version } from "../../package.json";
import Logo from "../assets/noaa-logo-circle.svg";

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
