import useOfflineStorage from "./useOfflineStorage";
import { useFormState } from "../contexts/FormWrapper";

const TOTAL_STEPS = 3;

function useMultStepForm(uuid) {
  const {
    formData,
    visibleInputs,
    setFormData,
    handleChange,
    handleBlur,
    validationErrors,
    handleMultiEntrySubmit,
  } = useFormState();
  const { createOfflineData, updateOfflineData } = useOfflineStorage();

  async function init() {
    const uuid = await createOfflineData("formData", {
      ...formData,
      currentStep: 1,
      totalSteps: TOTAL_STEPS,
    });
    setFormData({ ...formData, currentStep: 1, totalSteps: TOTAL_STEPS });
    return uuid;
  }

  function stepForward() {
    if (formData.currentStep < TOTAL_STEPS) {
      const nextStep = formData.currentStep + 1;
      setFormData({ ...formData, currentStep: nextStep });
      updateOfflineData("formData", { ...formData, uuid, currentStep: nextStep });
    }
  }

  function stepBackward() {
    if (formData.currentStep > 1) {
      const prevStep = formData.currentStep - 1;
      setFormData({ ...formData, currentStep: prevStep });
      updateOfflineData("formData", { ...formData, uuid, currentStep: prevStep });
      return;
    }
  }

  function handleSubmit() {
    console.log("handleSubmit: ", formData);
  }

  return {
    init,
    stepForward,
    stepBackward,
    handleSubmit,
    // below are composed useFormState values
    formData,
    visibleInputs,
    setFormData,
    handleChange,
    handleBlur,
    validationErrors,
    handleMultiEntrySubmit,
  };
}

export default useMultStepForm;
