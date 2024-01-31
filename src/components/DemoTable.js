import { Table } from "@trussworks/react-uswds";

const tableConfig = {
  head: ["Document title", "1776"],
  rows: [
    ["Declaration of Independence", "1776"],
    ["Bill of Rights", "1791"],
    ["Declaration of Sentiments", "1848"],
    ["Emancipation Proclamation", "1863"],
  ],
};

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
          {tableConfig.head.map((text) => {
            return <th scope="col">{text}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {tableConfig.rows.map((row) => {
          return (
            <tr>
              {row.map((cell, i) => {
                return i === 0 ? <th scope="row">{cell}</th> : <td>{cell}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};
