# react-radfish

![NPM Version](https://img.shields.io/npm/v/%40nmfs-radfish%2Freact-radfish)

The react-radfish NPM package contains the React component library needed to power any RADFish project built with React or React flavored framework (like Remix or Next.js). The idea is that these modules expose components that can be used in a consistent fashion across different React projects.

Note that this library is not meant to replace the @trussworks library, and is meant to live alongside it. Where possible, you should look to leverage the @trussworks library. However, if there is a component not exposed by @trussworks, or there is some shortcoming with the @trussworks implementation, you can rely on the components exposed from the @nmfs-radfish/react-radfish package.

## Installation

Install Radfish with npm:

```bash
npm install @nmfs-radfish/react-radfish
```

This library is open source and can be found here: https://www.npmjs.com/package/@nmfs-radfish/react-radfish

## Usage

React-Radfish provides components like Application Container, DatePicker, and Table, which simplify building NOAA-themed applications.

```jsx
import { Application, DatePicker, Table } from '@nmfs-radfish/react-radfish';

function MyApp() {
  return (
    <Application>
      <DatePicker />
      <Table data={tableData} columns={tableColumns} />
    </Application>
  );
}

export default MyApp;
```

For detailed documentation on these custom components, please visit the [React-Radfish Design System Documentation](https://nmfs-radfish.github.io/radfish/design-system/custom-components).

## Contributing
Contributions are welcome! If you would like to contribute, please read our [contributing guide](https://nmfs-radfish.github.io/radfish/about/contribute) and follow the steps.

