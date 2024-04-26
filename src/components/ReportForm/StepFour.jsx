import { useParams } from "react-router-dom";
import inputsMetadata from "../../config/InputsMetadata.json";
import { FormGroup } from "@trussworks/react-uswds";
import { Label, TextInput } from "../../packages/react-components";
import { CONSTANTS } from "../../config/form";
import useMultiStepForm from "../../hooks/useMultiStepForm";
import { FormSubmit } from "./FormSubmit";

const { numTrapsInWater, numTrapsHauled, numTrapsPerString, numBuoyLines } = CONSTANTS;

export const StepFour = () => {
  const { tripReportId } = useParams();
  const { formData, handleChange } = useMultiStepForm(tripReportId);
  return (
    <FormGroup error={false}>
      <h3>Step 4: Effort Information</h3>
      <Label htmlFor={numTrapsInWater}>
        {inputsMetadata.fields.effort[0].numTrapsInWater.label[0].en}
      </Label>
      <TextInput
        id={numTrapsInWater}
        name={numTrapsInWater}
        type="number"
        placeholder="0"
        value={formData[numTrapsInWater] || ""}
        onChange={handleChange}
      />
      <Label htmlFor={numTrapsHauled}>
        {inputsMetadata.fields.effort[1].numTrapsHauled.label[0].en}
      </Label>
      <TextInput
        id={numTrapsHauled}
        name={numTrapsHauled}
        type="number"
        placeholder="0"
        value={formData[numTrapsHauled] || ""}
        onChange={handleChange}
      />
      <Label htmlFor={numTrapsPerString}>
        {inputsMetadata.fields.effort[2].numTrapsPerString.label[0].en}
      </Label>
      <TextInput
        id={numTrapsPerString}
        name={numTrapsPerString}
        type="number"
        placeholder="0"
        value={formData[numTrapsPerString] || ""}
        onChange={handleChange}
      />
      <Label htmlFor={numBuoyLines}>
        {inputsMetadata.fields.effort[3].numBuoyLines.label[0].en}
      </Label>
      <TextInput
        id={numBuoyLines}
        name={numBuoyLines}
        type="number"
        placeholder="0"
        value={formData[numBuoyLines] || ""}
        onChange={handleChange}
      />
      <FormSubmit />
    </FormGroup>
  );
};
