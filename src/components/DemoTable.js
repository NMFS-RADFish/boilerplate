import { Table } from "@trussworks/react-uswds";
import { useTableState } from "../contexts/TableWrapper";

export const DemoTable = () => {
  const { tableConfig } = useTableState();
  if (!tableConfig) {
    return null;
  }
  return (
    <Table bordered caption={tableConfig?.caption || ""} fullWidth fixed>
      <thead>
        <tr>
          {tableConfig?.head?.map((text) => {
            return <th scope="col">{text}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {tableConfig?.rows?.map((row) => {
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
