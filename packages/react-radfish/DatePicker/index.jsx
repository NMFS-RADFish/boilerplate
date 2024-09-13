import React from "react";

export const DatePicker = ({
  type = "date",
  id,
  name,
  defaultValue,
  hintText,
  label,
  min,
  max,
  value,
  onChange,
  className = "",
}) => {
  const labelId = `${id}-label`;
  const hintId = `${id}-hint`;

  return (
    <div className={"usa-form-group " + className}>
      <label className="usa-label" id={labelId} htmlFor={id}>
        {label}
      </label>
      <div className="usa-hint" id={hintId}>
        {hintText}
      </div>
      <div className="usa-date-picker">
        <input
          type={type}
          defaultValue={defaultValue}
          onChange={onChange}
          value={value}
          className="usa-input"
          id={id}
          name={name}
          aria-labelledby={labelId}
          aria-describedby={hintId}
          min={min}
          max={max}
        />
      </div>
    </div>
  );
};
