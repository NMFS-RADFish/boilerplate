import { useParams } from "react-router-dom";
import { FormGroup } from "@trussworks/react-uswds";
import { Label, Select, TextInput } from "../../packages/react-components";
import { CONSTANTS } from "../../config/form";
import useMultiStepForm from "../../hooks/useMultiStepForm";
import { StepControl } from "./StepControl";

const { vesselName, activity } = CONSTANTS;

export const StepOne = ({ activityData }) => {
  const { formId } = useParams();
  const { formData, handleChange } = useMultiStepForm(formId);
  return (
    <FormGroup error={false}>
      <h3>Step 1: Basic Information</h3>
      <Label htmlFor={vesselName}>Vessel</Label>
      <TextInput
        id={vesselName}
        name={vesselName}
        type="text"
        placeholder="Vessel Name"
        value={formData[vesselName] || ""}
        onChange={handleChange}
        data-testid="inputId"
      />
      <Label htmlFor={activity}>Activity</Label>
      <Select name={activity} value={formData[activity] || ""} onChange={handleChange}>
        <option value="">Select Activity</option>
        {activityData?.map((activity) => (
          <option key={activity.KEY} value={activity.VALUE}>
            {activity.VALUE}
          </option>
        ))}
      </Select>
      <StepControl />
    </FormGroup>
  );
};
