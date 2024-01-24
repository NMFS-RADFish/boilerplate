import "./style.css";
import {
  TextInput as TwTextInput,
  Radio as TwRadio,
  Select as TwSelect,
} from "@trussworks/react-uswds";

const RadfishInput = (props) => {
  return <TwTextInput className="radfish-input" {...props} />;
};

const RadfishRadio = (props) => {
  return <TwRadio className="radfish-radio" {...props} />;
};

const RadfishSelect = (props) => {
  return <TwSelect className="radfish-select" {...props} />;
};

export { RadfishInput as TextInput, RadfishRadio as Radio, RadfishSelect as Select };
