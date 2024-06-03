import "./style.css";
import {
  TextInput as TwTextInput,
  Radio as TwRadio,
  Select as TwSelect,
  Label as TwLabel,
  ErrorMessage as TwErrorMessage,
} from "@trussworks/react-uswds";

const RADFishInput = (props) => {
  return (
    <TwTextInput
      {...props}
      className={`radfish-input ${props.className || ""}`}
    />
  );
};

const RADFishRadio = (props) => {
  return (
    <TwRadio {...props} className={`radfish-radio ${props.className || ""}`} />
  );
};

const RADFishSelect = (props) => {
  return (
    <TwSelect
      {...props}
      className={`radfish-select ${props.className || ""}`}
    />
  );
};

const RADFishInputLabel = (props) => {
  return (
    <TwLabel {...props} className={`radfish-label ${props.className || ""}`} />
  );
};

const RADFishErrorMessage = (props) => {
  return <TwErrorMessage {...props} className={`${props.className || ""}`} />;
};

export {
  RADFishInput as TextInput,
  RADFishRadio as Radio,
  RADFishSelect as Select,
  RADFishInputLabel as Label,
  RADFishErrorMessage as ErrorMessage,
};
