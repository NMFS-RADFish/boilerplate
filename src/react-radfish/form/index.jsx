import "./style.css";
import { Search as TwSearch } from "@trussworks/react-uswds";
const RadfishForm = (props) => {
  return (
    <form {...props} className={`radfish-form ${props.className}`}>
      {props.children}
    </form>
  );
};

const RadfishSearchForm = (props) => {
  return <TwSearch {...props} className={`radfish-search ${props.className}`} />;
};

export { RadfishForm as Form, RadfishSearchForm as Search };
