import React from 'react';
import './Tooltip.css'; // make sure to create a corresponding CSS file for styling

const Tooltip = ({ message }) => {
  return (
    <span className="tooltip">
      ?
      <span className="tooltiptext">{message}</span>
    </span>
  );
};

export default Tooltip;
