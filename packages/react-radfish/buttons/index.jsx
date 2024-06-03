import "./style.css";
import {
  Button as TwButton,
  NavMenuButton as TwNavMenuButton,
} from "@trussworks/react-uswds";

const RADFishButton = (props) => {
  return (
    <TwButton {...props} className={`radfish-button ${props.className || ""}`}>
      {props.children}
    </TwButton>
  );
};

const RADFishNavMenuButton = (props) => {
  return (
    <TwNavMenuButton
      {...props}
      className={`radfish-menu-btn ${props.className || ""}`}
    />
  );
};

export { RADFishButton as Button, RADFishNavMenuButton as NavMenuButton };
