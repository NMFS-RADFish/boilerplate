import "../index.css";
import React, { useState } from "react";
import {
  Banner,
  BannerHeader,
  BannerButton,
  BannerContent,
} from "@trussworks/react-uswds";
import { Button } from "@nmfs-radfish/react-radfish";
import { Link } from "react-router-dom";

function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="display-flex flex-column flex-align-center">
      <img src="/icons/radfish.png" alt="RADFish logo" height="200" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <p>
        <Link
          to="https://nmfs-radfish.github.io/documentation/docs/getting-started"
          target="_blank"
        >
          <Button>Documentation</Button>
        </Link>
      </p>
    </div>
  );
}

export default HomePage;
