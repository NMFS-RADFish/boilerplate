import React from "react";
import { Label } from "@trussworks/react-uswds";

export const DatePicker = ({
  type = "date",
  id,
  name,
  hint,
  label,
  className = "",
  error,
  srOnly,
  inputRef,
  required,
  ...props
}) => {
  const isRequired = required ? true : false;

  return (
    <div data-testid="date-picker" className={"usa-form-group " + className}>
      {label && (
        <Label
          htmlFor={id}
          hint={hint}
          error={error}
          srOnly={srOnly}
          requiredMarker={isRequired}
        >
          {label}
        </Label>
      )}
      <div className="usa-date-picker">
        <input
          data-testid="date-picker-input"
          type={type}
          className="usa-input"
          id={id}
          name={name}
          ref={inputRef}
          required={isRequired}
          {...props}
        />
      </div>
    </div>
  );
};
