import { useParams } from "react-router-dom";
import inputsMetadata from "../../config/InputsMetadata.json";
import { FormGroup } from "@trussworks/react-uswds";
import { Label, TextInput } from "../../packages/react-components";
import { CONSTANTS } from "../../config/form";
import useMultiStepForm from "../../hooks/useMultiStepForm";
import { StepControl } from "./StepControl";

const { trapsPerString, trapsInWater, avgSoakTime, totNrBuoyLines, date_land } = CONSTANTS;

export const StepThree = () => {
  const { tripReportId } = useParams();
  const { formData, handleChange } = useMultiStepForm(tripReportId);
  return (
    <FormGroup error={false}>
      <h3>Step 3: Trip Information</h3>
      <Label htmlFor={trapsPerString}>
        {inputsMetadata.fields.trip[0].trapsInWater.label[0].en}
      </Label>
      <TextInput
        id={trapsPerString}
        name={trapsPerString}
        type="number"
        placeholder="0"
        value={formData[trapsPerString] || ""}
        onChange={handleChange}
      />
      <Label htmlFor={trapsInWater}>
        {inputsMetadata.fields.trip[1].trapsPerString.label[0].en}
      </Label>
      <TextInput
        id={trapsInWater}
        name={trapsInWater}
        type="number"
        placeholder="0"
        value={formData[trapsInWater] || ""}
        onChange={handleChange}
      />
      <Label htmlFor={avgSoakTime}>{inputsMetadata.fields.trip[3].avgSoakTime.label[0].en}</Label>
      <TextInput
        id={avgSoakTime}
        name={avgSoakTime}
        type="number"
        placeholder="0"
        value={formData[avgSoakTime] || ""}
        onChange={handleChange}
      />
      <Label htmlFor={avgSoakTime}>
        {inputsMetadata.fields.trip[4].totNrBuoyLines.label[0].en}
      </Label>
      <TextInput
        id={totNrBuoyLines}
        name={totNrBuoyLines}
        type="number"
        placeholder="0"
        value={formData[totNrBuoyLines] || ""}
        onChange={handleChange}
      />
      <Label htmlFor={avgSoakTime}>Date Landed</Label>
      <TextInput
        id={date_land}
        name={date_land}
        type="text"
        placeholder="1/1/2024"
        value={formData[date_land] || ""}
        onChange={handleChange}
      />
      <StepControl />
    </FormGroup>
  );
};
