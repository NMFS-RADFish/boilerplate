# Multistep Form Example

[Official Documentation](https://nmfs-radfish.github.io/documentation/)

This example includes an example on how to build a form that includes multiple "steps", where each step is it's own `FormGroup`, and where the form needs to keep track of the current step that the user is on. For example, when a form is on step 2, whenever a user returns to that form, they should return to step 2, rather than starting the form from it's initial step. In order for this to work, we need to incorporate the `useOfflineStorage` hook to keep track of this in IndexedDB.

Additionally, the data within the form should cache into IndexedDB as the user types. This means, that the form will save the data inputted into the form into IndexedDB. So, when the user returns to the form, on their current step, the data within that form should persist, along with the current step of the form.

Learn more about RADFish examples at the official [documentation](https://nmfs-radfish.github.io/documentation/docs/building-your-application/templates_examples)

## Steps

1. You can follow the same pattern to build a simple form, as described in other examples within RADFish. The difference, is that we are adding an additional variable `TOTAL_STEPS` to declare how many steps this multistep form should have.

```jsx
const TOTAL_STEPS = 2;
```

The form behaves similarly to how a normal form would. However, we are adding two additional helper functions:

```jsx
// update form data, and increment currentStep by 1
const stepForward = () => {
  if (formData.currentStep < TOTAL_STEPS) {
    const nextStep = formData.currentStep + 1;
    setFormData({ ...formData, currentStep: nextStep });
    updateOfflineData("formData", [{ ...formData, uuid: formData.uuid, currentStep: nextStep }]);
  }
};

// update form data, and decrement currentStep by 1
const stepBackward = () => {
  if (formData.currentStep > 1) {
    const prevStep = formData.currentStep - 1;
    setFormData({ ...formData, currentStep: prevStep });
    updateOfflineData("formData", [{ ...formData, uuid: formData.uuid, currentStep: prevStep }]);
  }
};
```

These functions will update the form's data in state, along with updating the formData within IndexedDB. We are also incrementing or decrementing the `currentStep` of the form, so that this value can be used to render the correct step of the form, when returning to the page.

2. Additionally, we need to ensure that we initialize a multistep form within IndexedDB, in order to be provided a `uuid`, which we can use to query the correct `formData` from IndexedDB.

```jsx
const handleInit = async () => {
  const formId = await createOfflineData("formData", {
    ...formData,
    currentStep: 1,
    totalSteps: TOTAL_STEPS,
  });
  setFormData({ ...formData, currentStep: 1, totalSteps: TOTAL_STEPS });
  navigate(`${formId}`);
};
```

We can then subscribe to this `uuid` parameter in the url string to either query for the correct `formData`, or navigate to a new form if the `uuid` is not preset.

```jsx
const { id } = useParams();

useEffect(() => {
  const loadData = async () => {
    if (id) {
      const [found] = await findOfflineData("formData", {
        uuid: id,
      });

      if (found) {
        setFormData({ ...found, totalSteps: TOTAL_STEPS });
      } else {
        navigate("/");
      }
    }
  };
  loadData();
}, [id]);
```

3. Lastly, we can use `formData.currentStep` to conditionally render out the correct step within the jsx of this component:

```jsx
{
  formData.currentStep === 1 && (
    <FormGroup>
      <Label htmlFor={fullName}>Full Name</Label>
      <TextInput
        id={fullName}
        name={fullName}
        type="text"
        placeholder="Full Name"
        value={formData[fullName] || ""}
        onChange={handleChange}
      />
      <Label htmlFor={fullName}>Email</Label>
      <TextInput
        id={email}
        name={email}
        type="text"
        placeholder="user@example.com"
        value={formData[email] || ""}
        onChange={handleChange}
      />

      <Grid className="display-flex flex-justify">
        <Button
          type="button"
          className="margin-top-1 margin-right-0 order-last"
          onClick={stepForward}
        >
          Next Step
        </Button>
        <Button
          disabled
          type="button"
          className="margin-top-1"
          onClick={stepBackward}
          data-testid="step-backward"
          id="step-backward"
        >
          Prev Step
        </Button>
      </Grid>
    </FormGroup>
  );
}
```
