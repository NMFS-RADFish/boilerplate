import { Table } from "@trussworks/react-uswds";

export const DemoTable = () => {
  return (
    <Table
      bordered
      caption="This table uses the fixed prop to force equal width columns"
      fullWidth
      fixed
    >
      <thead>
        <tr>
          <th scope="col">Document title</th>
          <th scope="col">Year</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Declaration of Independence</th>
          <td>1776</td>
        </tr>
        <tr>
          <th scope="row">Bill of Rights</th>
          <td>1791</td>
        </tr>
        <tr>
          <th scope="row">Declaration of Sentiments</th>
          <td>1848</td>
        </tr>
        <tr>
          <th scope="row">Emancipation Proclamation</th>
          <td>1863</td>
        </tr>
      </tbody>
    </Table>
  );
};
