import React from 'react';
import './Tooltip.css';

const Tooltip = ({ message }) => {
  return (
    <span className="tooltip">
      ?
      <span className="tooltiptext">{message}</span>
    </span>
  );
};

export default Tooltip;
