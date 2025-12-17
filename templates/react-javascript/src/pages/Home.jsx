import "../index.css";
import React from "react";
import { Button } from "@trussworks/react-uswds";
import { Link } from "react-router-dom";
import { useRadFishConfig } from "../hooks/useRadFishConfig.jsx";

function HomePage() {
  const config = useRadFishConfig();

  return (
    <div className="display-flex flex-column flex-align-center">
      <img
        src={config.icons.logo}
        alt={`${config.app.shortName} logo`}
        height="200"
      />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <p>
        <Link
          to="https://nmfs-radfish.github.io/radfish/developer-documentation/getting-started"
          target="_blank"
        >
          <Button>Documentation</Button>
        </Link>
      </p>
    </div>
  );
}

export default HomePage;
