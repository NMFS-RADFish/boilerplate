import React from "react";

export const DatePicker = ({ type = "date", min, max, selectedDate, setSelectedDate }) => {
  const hintText = {
    date: "mm/dd/yyyy",
    time: "hh:mm",
    "datetime-local": "mm/dd/yyyy hh:mm",
  }[type];

  return (
    <div className="usa-date-range-picker">
      <div className="usa-form-group">
        <label className="usa-label" id="date-start-label" htmlFor="date-start">
          Start date
        </label>
        <div className="usa-hint" id="date-start-hint">
          {hintText}
        </div>
        <div className="usa-date-picker">
          <input
            type={type}
            onChange={(e) => {
              setSelectedDate(e.target.value);
            }}
            value={selectedDate}
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
    </div>
  );
};
