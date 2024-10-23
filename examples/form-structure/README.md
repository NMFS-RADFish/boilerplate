# Form Structure Example

[Official Documentation](https://nmfs-radfish.github.io/radfish/)

This example of building a non-trivial form using core component provided by [Trussworks react-uswds](https://github.com/trussworks/react-uswds).

This example is __NOT__ intended to show a full form implementation, such as sending a request on submit.

## Structure and CSS Examples

Trussworks `grid` components have been used to define the structure of the page.
`src/pages/Form.jsx`

```html
<GridContainer>
      <Grid row>
        <Grid col>
          <p className="text-bold text-center">
```

How to place to `input` components on a row.

```html
<Grid row gap>
    <Grid col={8}>
        <Label htmlFor="middle-name" className="text-bold">Middle Name:</Label>
        <TextInput id="middle-name" name="middleName" />
    </Grid>
    <Grid col={4}>
        <Label htmlFor="suffix-select" className="text-bold"> Suffix: </Label>
        <Select id="suffix-select" name="suffixSelect" >
```

Several techniques for applying CSS to get the desired results have been used.

- Component props

```html
<Grid row gap="md">
```

- USWDS classes

```html
<Grid row className="flex-justify-center">
```

- Custom CSS classes

```html
<div className="app-input-boundary">
```

## Secondary Examples

The form does include two additional examples.

1. Setting the `focus` when the `form` loads and resets.

```js
  const inputFocus = useRef(null);
  useEffect(() => {
    if (inputFocus.current) {
      inputFocus.current.focus();
    };
    setResetToggle(false);
  }, [resetToggle]);
```

```html
<Select
    id="permit-year-select"
    name="permitYear"
    inputRef={inputFocus}
```

1. Display `FormData` values on `Submit` and reset the form.

```js
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const values = {};
    let alertString = '';

    for (const [key, value] of formData.entries()) {
      values[key] = value;
      alertString += `${key}: ${value}\n`;
    }

    window.alert(alertString);
    // Reset for after triggering Submit
    event.target.reset();
    // Set focus on first input after form is submitted.
    setResetToggle(true)
  }
```
