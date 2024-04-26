import "../styles/theme.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../packages/react-components";
import useOfflineStorage from "../hooks/useOfflineStorage.example";
import { useParams } from "react-router-dom";
import useMultiStepForm, { TOTAL_STEPS } from "../hooks/useMultiStepForm";
import { StepOne } from "../components/ReportForm/StepOne";
import { StepTwo } from "../components/ReportForm/StepTwo";
import { StepThree } from "../components/ReportForm/StepThree";
import { StepFour } from "../components/ReportForm/StepFour";

const ReportForm = () => {
  const { findOfflineData } = useOfflineStorage();
  const { tripReportId, formId } = useParams();
  const navigate = useNavigate();
  const { init, formData, setFormData } = useMultiStepForm(formId);

  const [reportType, setReportType] = useState("");
  const [tripType, setTripType] = useState("");
  const [activityData, setActivityData] = useState([]);
  const [speciesData, setSpeciesData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      if (formId) {
        const found = await findOfflineData("formData", {
          uuid: formId,
        });
        console.log(found[0]);
        if (found) {
          setFormData({ ...found[0], totalSteps: TOTAL_STEPS });
        }
      } else {
        navigate(`/tripReport/${tripReportId}`);
      }
    };
    loadData();
  }, [formId]);

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

  const initializeMultistepForm = async () => {
    const uuid = await init();
    navigate(`/tripReport/${tripReportId}/${uuid}`);
  };

  if (!formData || !reportType || !tripType) {
    return null;
  }

  return (
    <>
      <h1>{reportType} Report Form</h1>
      <p>Trip Type: {tripType}</p>

      {!formData.currentStep && (
        <Button type="button" onClick={initializeMultistepForm}>
          Initialize Report Form
        </Button>
      )}
      {formData.currentStep === 1 && <StepOne activityData={activityData} />}
      {formData.currentStep === 2 && <StepTwo speciesData={speciesData} />}
      {formData.currentStep === 3 && <StepThree />}
      {formData.currentStep === 4 && <StepFour />}
    </>
  );
};

export { ReportForm };
