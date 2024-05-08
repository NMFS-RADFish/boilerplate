import "./style.css";
import { Header as TwHeader, PrimaryNav as TwPrimaryNav } from "@trussworks/react-uswds";
import { NavMenuButton } from "../buttons";
import { Search } from "../form";

const RadfishHeader = (props) => {
  return (
    <TwHeader {...props}>
      <div className="radfish-nav-container">{props.children}</div>
    </TwHeader>
  );
};

const RadfishNavigation = (props) => {
  return (
    <div className="radfish-nav-container">
      <NavMenuButton onClick={props.onClick} label="Menu" />
      <TwPrimaryNav
        items={props.items}
        mobileExpanded={props.expanded}
        onToggleMobileNav={props.onClick}
      >
        <Search size="small" onSubmit={() => console.log("search submit not implemented")} />
      </TwPrimaryNav>
    </div>
  );
};

export { RadfishHeader as Header, RadfishNavigation as Navigation };
