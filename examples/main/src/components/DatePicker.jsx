import React, { useState } from "react";

const DatePicker = () => {
  const [selectedDate, setSelectedDate] = useState("");

  return (
    <div className="usa-date-range-picker">
      <div className="usa-form-group">
        <label className="usa-label" id="date-start-label" htmlFor="date-start">
          Start date
        </label>
        <div className="usa-hint" id="date-start-hint">
          mm/dd/yyyy
        </div>
        <div className="usa-date-picker">
          <input
            type="date"
            onChange={(e) => {
              setSelectedDate(e.target.value);
            }}
            value={selectedDate}
            className="usa-input"
            id="date-start"
            name="date-start"
            aria-labelledby="date-start-label"
            aria-describedby="date-start-hint"
          />
        </div>
      </div>
    </div>
  );
};
export default DatePicker;
