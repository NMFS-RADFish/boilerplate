import "../styles/theme.css";
import inputsMetadata from "../config/InputsMetadata.json";
import React, { useState, useEffect } from "react";
import { FormGroup } from "@trussworks/react-uswds";
import { TextInput, Select, Button, Label } from "../packages/react-components";
import { useFormState } from "../contexts/FormWrapper";
import { CONSTANTS } from "../config/form";
import useOfflineStorage from "../hooks/useOfflineStorage.example";
import { useParams } from "react-router-dom";

const {
  vesselName,
  activity,
  species,
  trapsInWater,
  trapsPerString,
  avgSoakTime,
  totNrBuoyLines,
  date_land,
  numTrapsInWater,
  numTrapsHauled,
  numTrapsPerString,
  numBuoyLines,
} = CONSTANTS;

const ReportForm = () => {
  const { findOfflineData } = useOfflineStorage();
  const { formData, handleChange } = useFormState();
  const { tripReportId } = useParams();

  const [reportType, setReportType] = useState("");
  const [tripType, setTripType] = useState("");
  const [activityData, setActivityData] = useState([]);
  const [speciesData, setSpeciesData] = useState([]);

  useEffect(() => {
    const queryFormData = async () => {
      const [report] = await findOfflineData("offlineTripReportData", {
        KEY: parseInt(tripReportId),
      });
      const [tripType] = await findOfflineData("tripTypesData", {
        KEY: parseInt(report.TRIP_TYPE),
      });
      const activityData = await findOfflineData("activityData");
      const speciesData = await findOfflineData("speciesData");

      setReportType(report.VALUE);
      setTripType(tripType.VALUE);
      setActivityData(activityData);
      setSpeciesData(speciesData);
    };
    queryFormData();
  }, []);

  return (
    <>
      <h1>{reportType} Report Form</h1>
      <p>Trip Type: {tripType}</p>

      <h3>Step 1: Basic Information</h3>
      <FormGroup error={false}>
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
      </FormGroup>

      <h3>Step 2: Catch Information</h3>
      <FormGroup error={false}>
        <Label htmlFor={species}>Species</Label>
        <Select name={species} value={formData[species] || ""} onChange={handleChange}>
          <option value="">Select Species</option>

          {speciesData?.map((species) => (
            <option key={species.SPPCODE} value={species.SPPNAME}>
              {species.SPPNAME}
            </option>
          ))}
        </Select>
      </FormGroup>

      <h3>Step 3: Trip Information</h3>
      <FormGroup error={false}>
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
        <Label htmlFor={trapsPerString}>
          {inputsMetadata.fields.trip[2].stringsHauled.label[0].en}
        </Label>
        <TextInput
          id={trapsPerString}
          name={trapsPerString}
          type="number"
          placeholder="0"
          value={formData[trapsPerString] || ""}
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
      </FormGroup>

      <h3>Step 4: Effort Information</h3>
      <FormGroup error={false}>
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
      </FormGroup>

      <div className="grid-row flex-column">
        <Button role="form-submit" type="submit">
          {navigator.onLine ? "Online Submit" : "Offline Submit"}
        </Button>
      </div>
    </>
  );
};

export { ReportForm };
