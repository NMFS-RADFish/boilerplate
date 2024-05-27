import "./style.css";
import {
  TextInput as TwTextInput,
  Radio as TwRadio,
  Select as TwSelect,
  Label as TwLabel,
  ErrorMessage as TwErrorMessage,
} from "@trussworks/react-uswds";

const RadfishInput = (props) => {
  return <TwTextInput {...props} className={`radfish-input ${props.className || ""}`} />;
};

const RadfishRadio = (props) => {
  return <TwRadio {...props} className={`radfish-radio ${props.className || ""}`} />;
};

const RadfishSelect = (props) => {
  return <TwSelect {...props} className={`radfish-select ${props.className || ""}`} />;
};

const RadfishInputLabel = (props) => {
  return <TwLabel {...props} className={`radfish-label ${props.className || ""}`} />;
};

const RadfishErrorMessage = (props) => {
  return <TwErrorMessage {...props} className={`${props.className || ""}`} />;
};

export {
  RadfishInput as TextInput,
  RadfishRadio as Radio,
  RadfishSelect as Select,
  RadfishInputLabel as Label,
  RadfishErrorMessage as ErrorMessage,
};
