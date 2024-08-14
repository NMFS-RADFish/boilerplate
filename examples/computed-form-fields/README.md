# Computed Form Fields Example

[Official Documentation](https://nmfs-radfish.github.io/documentation/)

This example includes an example on how to build a form where the values of certain input fields compute the value of a separate readOnly input field elsewhere in the form.

Learn more about RADFish examples at the official [documentation](https://nmfs-radfish.github.io/documentation/docs/building-your-application/templates_examples)

## Steps

1. Before building out your form, it's a good idea to define which inputs you want to render, and create constant variables for them, so that you can reference these variables, rather than typing out plain text strings. This reduces the possibility of typos and human error when building out reference logic:

```jsx
const species = "species";
const numberOfFish = "numberOfFish";
const computedPrice = "computedPrice";
```

In this example, we will build a form with three inputs. The values from the first two inputs will compute the value of `computedPrice`.

2. Next, let's define our `Form` component, and intialize it with an empty `formState` object:

```jsx
const ComputedForm = () => {
  const [formData, setFormData] = useState({});

  return (
    // form JSX will go here
  );
};
```

3. In the `Form.jsx` component, you can now build out the jsx inputs form your `Form` within the `return` statement of the component. See the below to see an example of how to build these inputs. Notice how we are referencing the variables defined in step 1, rather than typing out the plain strings to avoid typos, and use the variable to access the `formData` state. It's a good idea to wrap these inputs within a `FormGroup` component provided from the trussworks library.

```jsx
<TextInput
  id={numberOfFish}
  name={numberOfFish}
  type="number"
  placeholder="0"
  value={formData[numberOfFish] || ""}
/>
```

4. Now, for each input, we can create an `onChange` handler, that captures the input's value as it is being typed. We then update state with a copy of the existing `formState`, and update only the field value that we want to update (in this case `numberOfFish`). The value of this input will then re-render with the updated value from `formState`

```jsx
<TextInput
  id={numberOfFish}
  name={numberOfFish}
  type="number"
  placeholder="0"
  value={formData[numberOfFish] || ""}
  onChange={(event) => {
    const { value } = event.target;
    setFormData({
      ...formData,
      [numberOfFish]: value,
    });
  }}
/>
```

5. In addition to updating the input value of `numberOfFish`, we also want to update the value of `computedPrice`. We can do that by adding a helper function to run some logic to compute that value (usually based on other form field values), and then calling that helper function in the input's `onChange` handler:

```jsx
<TextInput
  id={numberOfFish}
  name={numberOfFish}
  type="number"
  placeholder="0"
  value={formData[numberOfFish] || ""}
  onChange={(event) => {
    const { value } = event.target;
    setFormData({
      ...formData,
      [numberOfFish]: value,
      [computedPrice]: computeFieldValue(value, formData?.species || ""),
    });
  }}
/>;

// this function can live outside of the component, since it doesn't hook into react state.
const computeFieldValue = (numberOfFish, species) => {
  const speciesPriceMap = {
    grouper: 25.0,
    salmon: 58.0,
    marlin: 100.0,
    mahimahi: 44.0,
  };

  let computedPrice = parseInt(numberOfFish || 0) * parseInt(speciesPriceMap[species] || 0);
  return computedPrice.toString();
};
```
