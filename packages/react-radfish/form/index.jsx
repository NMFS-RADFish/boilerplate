import "./style.css";
import { Search as TwSearch } from "@trussworks/react-uswds";
const RADFishForm = (props) => {
  return (
    <form {...props} className={`radfish-form ${props.className || ""}`}>
      {props.children}
    </form>
  );
};

const RADFishSearchForm = (props) => {
  return (
    <TwSearch
      {...props}
      className={`radfish-search ${props.className || ""}`}
    />
  );
};

export { RADFishForm as Form, RADFishSearchForm as Search };
