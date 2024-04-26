import { useParams } from "react-router-dom";
import { Grid } from "@trussworks/react-uswds";
import { Button } from "../../packages/react-components";
import useMultiStepForm from "../../hooks/useMultiStepForm";

export const FormSubmit = () => {
  const { formId } = useParams();
  const { stepBackward } = useMultiStepForm(formId);
  return (
    <Grid className="display-flex flex-justify">
      <Button
        type="button"
        className="margin-top-1"
        onClick={stepBackward}
        data-testid="step-backward"
      >
        Prev Step
      </Button>
      <Button role="form-submit" type="submit">
        {navigator.onLine ? "Online Submit" : "Offline Submit"}
      </Button>
    </Grid>
  );
};
