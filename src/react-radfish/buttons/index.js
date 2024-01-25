import "./style.css";
import { Button as TwButton, NavMenuButton as TwNavMenuButton } from "@trussworks/react-uswds";

const RadfishButton = (props) => {
  return (
    <TwButton className="radfish-button" {...props}>
      {props.children}
    </TwButton>
  );
};

const RadfishNavMenuButton = (props) => {
  return <TwNavMenuButton className="radfish-menu-btn" {...props} />;
};

export { RadfishButton as Button, RadfishNavMenuButton as NavMenuButton };
