import "./style.css";
import { Button as TwButton, NavMenuButton as TwNavMenuButton } from "@trussworks/react-uswds";

const RadfishButton = (props) => {
  return (
    <TwButton {...props} className={`radfish-button ${props.className || ""}`}>
      {props.children}
    </TwButton>
  );
};

const RadfishNavMenuButton = (props) => {
  return <TwNavMenuButton {...props} className={`radfish-menu-btn ${props.className || ""}`} />;
};

export { RadfishButton as Button, RadfishNavMenuButton as NavMenuButton };
