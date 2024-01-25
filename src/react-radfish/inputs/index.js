import "./style.css";
import {
  TextInput as TwTextInput,
  Radio as TwRadio,
  Select as TwSelect,
  Label as TwLabel,
  ErrorMessage as TwErrorMessage,
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

const RadfishInputLabel = (props) => {
  return <TwLabel className="radfish-label" {...props} />;
};

const RadfishErrorMessage = (props) => {
  return <TwErrorMessage className="radfish-error-message" {...props} />;
};

export {
  RadfishInput as TextInput,
  RadfishRadio as Radio,
  RadfishSelect as Select,
  RadfishInputLabel as Label,
  RadfishErrorMessage as ErrorMessage,
};
