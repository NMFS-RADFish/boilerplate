import React from "react";

export const DatePicker = ({ type = "date", hintText, label, min, max, value, onChange }) => {
  return (
    <div className="usa-form-group">
      <label className="usa-label" id="date-start-label" htmlFor="date-start">
        {label}
      </label>
      <div className="usa-hint" id="date-start-hint">
        {hintText}
      </div>
      <div className="usa-date-picker">
        <input
          type={type}
          onChange={onChange}
          value={value}
          className="usa-input"
          id="date-start"
          name="date-start"
          aria-labelledby="date-start-label"
          aria-describedby="date-start-hint"
          min={min}
          max={max}
        />
      </div>
    </div>
  );
};
