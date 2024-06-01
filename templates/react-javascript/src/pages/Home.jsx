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
    <div>
      <h1>Welcome</h1>
      <p>Built with RADFish 🐟</p>
      <p>
        <Link
          to="https://nmfs-radfish.github.io/documentation/docs/getting-started"
          target="_blank"
        >
          <Button>Get started</Button>
        </Link>
      </p>
    </div>
  );
}

export default HomePage;
