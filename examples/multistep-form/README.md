# Multistep Form Example

This example shows you how to create a multi-step form. Each step in the form is encapsulated within its own `FormGroup`. The form tracks the user's progress. When a user returns to the form, they resume at their last completed step rather than starting from the beginning. For example, if the user left off at Step 2, the form automatically restores them to Step 2 upon their return. To achieve this, we use the `useOfflineStorage` hook to store the current step in **IndexedDB**.

Additionally, the form data is cached in **IndexedDB** as the user types. This ensures that both the form's progress and its input data persist across sessions. When the user revisits the form, they will see their previously entered data and resume at their saved step.

Learn more about RADFish examples at the official [documentation](https://nmfs-radfish.github.io/radfish/developer-documentation/examples-and-templates#examples). Refer to the [RADFish GitHub repo](https://nmfs-radfish.github.io/radfish/) for more information and code samples.

## Preview
This example will render as shown in this screenshot:

![Multistep Form](./src/assets/multistep.png)

## Steps

### 1. Define the Total Number of Steps
Declare the total number of steps for your multi-step form using a constant variable. This allows you to control the flow and logic of the form.

```jsx
const TOTAL_STEPS = 2;
```

This declaration ensures the form knows how many steps are included. This helps manage navigation between steps.

### 2. Initialize Multi-Step Form in IndexedDB

We need to create an entry in IndexedDB so the form is properly initialized with a `uuid` for persistence. This `uuid` will allow us to query the correct `formData` and track the state of the form.

```jsx
const handleInit = async () => {
  const formId = await createOfflineData("formData", {
    ...formData,
    currentStep: 1,
    totalSteps: TOTAL_STEPS,
  });
  setFormData({ ...formData, currentStep: 1, totalSteps: TOTAL_STEPS });
  navigate(`${formId}`); // Navigate to the form using its unique ID
};
```
This function:
- Initializes the `formData` in IndexedDB with the current step set to 1.
- Assigns a `uuid` to the form, which is used for querying and tracking.
- Navigates to the unique `formId` in the URL.

### 3. Create Navigation Helper Functions
After initializing the form, define two helper functions: `stepForward` and `stepBackward`. These functions handle the logic to move between steps while updating the form's state and persisting the data to IndexedDB.

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

These functions will update the form's data in state, along with updating the formData within IndexedDB. We also increment or decrement the `currentStep` of the form. This value can then be used to render the correct step of the form, when returning to the page.

### 4. Subscribe to the `uuid` Parameter in the URL
We can then subscribe to this `uuid` parameter in the URL string. We can either query for the correct `formData`, or navigate to a new form if the `uuid` is not preset.

```jsx
const { id } = useParams();

useEffect(() => {
  const loadData = async () => {
    if (id) {
      const [found] = await findOfflineData("formData", {
        uuid: id, // Query IndexedDB using the `uuid`
      });

      if (found) {
        setFormData({ ...found, totalSteps: TOTAL_STEPS }); // Load the data into state
      } else {
        navigate("/"); irect to the root if no data is found
      }
    }
  };
  loadData();
}, [id]);
```
This ensures:

- The form resumes at the correct step when the user revisits the page.
- Invalid or missing `uuid` values redirect users to start a new form.


### 5. Render the Current Step Dynamically 
Use the `formData.currentStep` value to conditionally render the correct form step. This allows you to show only the relevant inputs for the current step while keeping the form flexible.

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
**Key Points:**

- `stepForward` moves to the next step, while `stepBackward` goes to the previous step.
- The "Prev Step" button is disabled on the first step to prevent invalid navigation.
- The form dynamically updates based on the `currentStep` value.

