import "./style.css";
import { Search as TwSearch } from "@trussworks/react-uswds";
const RadfishForm = (props) => {
  return (
    <form className="radfish-form" {...props}>
      {props.children}
    </form>
  );
};

const RadfishSearchForm = (props) => {
  return <TwSearch className="radfish-search" {...props} />;
};

export { RadfishForm as Form, RadfishSearchForm as Search };
