import { useParams } from "react-router-dom";
import { Grid } from "@trussworks/react-uswds";
import { Button } from "../../packages/react-components";
import useMultiStepForm from "../../hooks/useMultiStepForm";

export const StepControl = () => {
  const { tripReportId } = useParams();
  const { stepForward, stepBackward } = useMultiStepForm(tripReportId);
  return (
    <Grid className="display-flex flex-justify">
      <Button
        type="button"
        className="margin-top-1 margin-right-0 order-last"
        onClick={stepForward}
        data-testid="step-forward"
      >
        Next Step
      </Button>
      <Button
        type="button"
        className="margin-top-1"
        onClick={stepBackward}
        data-testid="step-backward"
      >
        Prev Step
      </Button>
    </Grid>
  );
};
