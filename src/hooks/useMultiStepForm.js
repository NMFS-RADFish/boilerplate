import { useEffect, useState } from "react";
import useFormStorage from "./useFormStorage";
import { useFormState } from "../contexts/FormWrapper";

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
  const { create, find, update } = useFormStorage();
  //   const storageMethod = new LocalStorageMethod("formData");
  //   const storageModel = StorageModelFactory.createModel(storageMethod);
  // const multiStepForm = new MultiStepFormModel(uuid);
  let [currentStep, setCurrentStep] = useState(0);

  function init() {
    const uuid = create({ ...formData, currentStep: currentStep + 1 });
    setFormData({ ...formData, currentStep: currentStep + 1 });
    return uuid;
  }

  function stepForward() {
    console.log(stepForward);
    const nextStep = formData.currentStep + 1;
    setFormData({ ...formData, currentStep: nextStep });
    update({ uuid }, { ...formData, currentStep: nextStep });
  }

  function stepBackward() {
    const prevStep = formData.currentStep - 1;
    setFormData({ ...formData, currentStep: prevStep });
    update({ uuid }, { ...formData, currentStep: prevStep });
  }

  function handleSubmit() {
    console.log("handleSubmit: ", currentStep);
  }

  return {
    init,
    stepForward,
    stepBackward,
    handleSubmit,
    currentStep,
    //
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
