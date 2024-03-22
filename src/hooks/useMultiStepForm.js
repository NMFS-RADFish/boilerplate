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
  const { createOfflineDataEntry, updateOfflineDataEntry } = useOfflineStorage();

  function init() {
    const uuid = createOfflineDataEntry({ ...formData, currentStep: 1, totalSteps: TOTAL_STEPS });
    setFormData({ ...formData, currentStep: 1, totalSteps: TOTAL_STEPS });
    return uuid;
  }

  function stepForward() {
    if (formData.currentStep < TOTAL_STEPS) {
      const nextStep = formData.currentStep + 1;
      setFormData({ ...formData, currentStep: nextStep });
      updateOfflineDataEntry({ uuid }, { ...formData, currentStep: nextStep });
    }
  }

  function stepBackward() {
    if (formData.currentStep > 1) {
      const prevStep = formData.currentStep - 1;
      setFormData({ ...formData, currentStep: prevStep });
      updateOfflineDataEntry({ uuid }, { ...formData, currentStep: prevStep });
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
