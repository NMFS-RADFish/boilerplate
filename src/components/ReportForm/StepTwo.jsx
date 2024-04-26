import { useParams } from "react-router-dom";
import { FormGroup } from "@trussworks/react-uswds";
import { Label, Select } from "../../packages/react-components";
import { CONSTANTS } from "../../config/form";
import useMultiStepForm from "../../hooks/useMultiStepForm";
import { StepControl } from "./StepControl";

const { species } = CONSTANTS;

export const StepTwo = ({ speciesData }) => {
  const { tripReportId } = useParams();
  const { formData, handleChange } = useMultiStepForm(tripReportId);
  return (
    <FormGroup error={false}>
      <h3>Step 2: Catch Information</h3>
      <Label htmlFor={species}>Species</Label>
      <Select name={species} value={formData[species] || ""} onChange={handleChange}>
        <option value="">Select Species</option>

        {speciesData?.map((species) => (
          <option key={species.SPPCODE} value={species.SPPNAME}>
            {species.SPPNAME}
          </option>
        ))}
      </Select>
      <StepControl />
    </FormGroup>
  );
};
